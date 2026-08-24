# syntax=docker/dockerfile:1

##### STAGE 1: deps #####
# Install dependencies terpisah supaya layer ini bisa di-cache oleh Docker
# selama package.json / package-lock.json tidak berubah.
FROM node:22-alpine AS deps

# Mengatur direktori kerja
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

##### STAGE 2: builder #####
# Generate Prisma client lalu build Next.js.
FROM node:22-alpine AS builder

# Mengatur direktori kerja
WORKDIR /app

# Copy dependencies dari stage sebelumnya
COPY --from=deps /app/node_modules ./node_modules

# Copy seluruh source code ke dalam container
COPY . .

# Prisma butuh DATABASE_URL saat "generate", tapi hanya untuk baca schema,
# bukan konek ke DB betulan — nilai dummy di sini aman.
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"

# Generate Prisma client untuk production
RUN npx prisma generate

# Build project Next.js
RUN npm run build

##### STAGE 3: runner #####
# Image final: hanya berisi hasil build standalone Next.js, tanpa source
# code mentah maupun devDependencies.
FROM node:22-alpine AS runner

# Mengatur direktori kerja
WORKDIR /app

# Environment variable untuk production
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Jalankan sebagai non-root user demi keamanan.
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Hasil `output: 'standalone'` di next.config.mjs: server.js minimal
# beserta node_modules yang benar-benar dipakai saja.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma client hasil generate perlu ikut, karena standalone output
# Next.js tidak selalu membawa seluruh file .prisma secara sempurna.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Jalankan sebagai non-root user
USER nextjs

# Port yang akan diakses dari luar container
EXPOSE 3000

# Menentukan command untuk menjalankan container
CMD ["node", "server.js"]