import pkg from '@prisma/client' 
// 1. Import đúng chuẩn: Chỉ đích danh PrismaPg (Named Export)
import { PrismaPg } from '@prisma/adapter-pg' 
// Import thư viện pg và lấy ra công cụ Pool
import pg from 'pg'
import 'dotenv/config'

const { PrismaClient } = pkg 
const { Pool } = pg  

// 2. Khởi tạo đường dây kết nối trực tiếp với Postgres
const pool = new Pool({ connectionString: process.env.DATABASE_URL }) 
const adapter = new PrismaPg(pool) 

// 3. Khởi tạo PrismaClient V7 với Adapter
const prisma = new PrismaClient({ adapter }) 

export default prisma
