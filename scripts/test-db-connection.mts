import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Test the connection
    await prisma.$connect()
    console.log('Successfully connected to the database')

    // Test a simple query
    const userCount = await prisma.user.count()
    console.log(`Number of users in the database: ${userCount}`)

    // Test creating a user
    const newUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
      },
    })
    console.log('Created new user:', newUser)

    // Test querying the new user
    const queriedUser = await prisma.user.findUnique({
      where: { id: newUser.id },
    })
    console.log('Queried user:', queriedUser)

    // Clean up: delete the test user
    await prisma.user.delete({
      where: { id: newUser.id },
    })
    console.log('Deleted test user')

  } catch (error) {
    console.error('Error testing database connection:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()