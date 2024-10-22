// import { PrismaClient, UserType } from '@prisma/client'

// const prisma = new PrismaClient()

// async function main() {
//   // Create roles
//   const adminRole = await prisma.role.upsert({
//     where: { name: 'Admin' },
//     update: {},
//     create: { name: 'Admin', description: 'Administrator role' },
//   })

//   const vendorRole = await prisma.role.upsert({
//     where: { name: 'Vendor' },
//     update: {},
//     create: { name: 'Vendor', description: 'Vendor role' },
//   })

//   const customerRole = await prisma.role.upsert({
//     where: { name: 'Customer' },
//     update: {},
//     create: { name: 'Customer', description: 'Customer role' },
//   })

//   // Create users
//   const admin = await prisma.admin.upsert({
//     where: { email: 'admin@example.com' },
//     update: {},
//     create: { name: 'Admin User', email: 'admin@example.com' },
//   })

//   const vendor = await prisma.vendor.upsert({
//     where: { email: 'vendor@example.com' },
//     update: {},
//     create: { name: 'Vendor User', email: 'vendor@example.com' },
//   })

//   const customer = await prisma.customer.upsert({
//     where: { email: 'customer@example.com' },
//     update: {},
//     create: { name: 'Customer User', email: 'customer@example.com' },
//   })

//   // Assign roles to users
//   await prisma.userRole.createMany({
//     data: [
//       { roleId: adminRole.id, targetId: admin.id, targetType: UserType.ADMIN },
//       { roleId: vendorRole.id, targetId: vendor.id, targetType: UserType.VENDOR },
//       { roleId: customerRole.id, targetId: customer.id, targetType: UserType.CUSTOMER },
//     ],
//   })

//   console.log('Seed data created successfully')
// }

// main()
//   .catch((e) => {
//     console.error(e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })
