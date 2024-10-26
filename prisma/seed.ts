const { PrismaClient, UserType } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Create roles
  const adminRole = await prisma.role.create({
    data: { name: 'Admin', description: 'Administrator role', type: UserType.ADMIN },
  })

  const vendorRole = await prisma.role.create({
    data: { name: 'Vendor', description: 'Vendor role', type: UserType.VENDOR },
  })

  const customerRole = await prisma.role.create({
    data: { name: 'Customer', description: 'Customer role', type: UserType.CUSTOMER },
  })

  // Create users
  const admin = await prisma.userBasic.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { full_name: 'Admin User', email: 'admin@example.com', role_id: adminRole.id },
  })

  const vendor = await prisma.userBasic.upsert({
    where: { email: 'vendor@example.com' },
    update: {},
    create: { full_name: 'Vendor User', email: 'vendor@example.com', role_id: vendorRole.id },
  })

  const customer = await prisma.userBasic.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: { full_name: 'Customer User', email: 'customer@example.com', role_id: customerRole.id },
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
