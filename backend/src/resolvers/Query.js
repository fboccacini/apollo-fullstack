async function feed(parent, args, context, info) {
  const where = args.filter
    ? {
      OR: [
        { description: { contains: args.filter } },
        { url: { contains: args.filter } },
      ],
    }
    : {}

  const links = await context.prisma.link.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
  })

  const count = await context.prisma.link.count({ where })

  return {
    id: 'main-feed',
    links,
    count,
  }
}

const isEmpty = require("lodash/isEmpty");
async function loggedInUser(_, __, { req }) {
  if (isEmpty(req.user)) throw new AuthenticationError("Must authenticate");
  const user = await users.get({ userId: req.user.id });
  return user;
}

module.exports = {
  feed,
  loggedInUser,
}