const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.colleciton.countDocuments(),
    allBooks: async (root, args) => {
      const authorFilter = await Author.findOne({ name: args.author })

      if (args.author && args.genre) {
        return await Book.find({
          author: authorFilter?.id,
          genres: args.genre,
        }).populate('author')
      } else if (args.author) {
        return Book.find({ author: authorFilter?.id }).populate('author')
      } else if (args.genre) {
        return Book.find({ genres: args.genre }).populate('author')
      }
      return Book.find({}).populate('author')
    },
    allAuthors: async () => Author.find({}).populate('books'),
    me: (root, args, context) => {
      return context.currentUser
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser)
        throw new GraphQLError('', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })

      let author
      try {
        author = await Author.findOneAndUpdate(
          { name: args.author },
          { $setOnInsert: { name: args.author } },
          { upsert: true, new: true }
        )
      } catch (error) {
        throw new GraphQLError('Saving Author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
            error,
          },
        })
      }

      const book = new Book({ ...args, author: author.id })
      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Saving Book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        })
      }

      await book.populate('author')
      await Author.updateOne(
        { name: author.name },
        { $addToSet: { books: book.id } }
      )
      pubsub.publish('BOOK_CREATED', { bookAdded: book })

      return book
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser)
        throw new GraphQLError('', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })

      const author = await Author.findOne({ name: args.name })

      try {
        author.born = args.setBornTo
        await author.save()
      } catch (error) {
        throw new GraphQLError('Saving Author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }

      return author
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })

      return user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return {
        value: `Bearer ${jwt.sign(userForToken, process.env.JWT_SECRET)}`,
      }
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_CREATED']),
    },
  },

  Author: {
    bookCount: async (root) => {
      const author = await Author.findById(root._id)
      return author.books.length
    },
  },
}

module.exports = resolvers
