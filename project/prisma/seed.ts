import { PrismaClient } from '@prisma/client'

import exhibits from '../src/data/exhibits'
import gallery from '../src/data/gallery'
import historicalEvents from '../src/data/historicalEvents'
import people from '../src/data/people'

const prisma = new PrismaClient()

async function main() {
  // Exhibit
  for (const item of exhibits) {
    await prisma.exhibit.create({
      data: {
        id: item.id,
        name: item.name,
        description: item.description,
        imageUrl: item.imageUrl,
        year: item.year,
        category: item.category,
        technicalDetails: item.technicalDetails ?? null,
        historicalContext: item.historicalContext ?? null,
      }
    })
  }

  // GalleryImage
  for (const item of gallery) {
    await prisma.galleryImage.create({
      data: {
        id: item.id,
        category: item.category,
        imageUrl: item.imageUrl,
      }
    })
  }

  // HistoricalEvent
  for (const item of historicalEvents) {
    await prisma.historicalEvent.create({
      data: {
        id: item.id,
        title: item.title,
        date: item.date,
        description: item.description,
        imageUrl: item.imageUrl,
      }
    })
  }

  // Person
  for (const item of people) {
    await prisma.person.create({
      data: {
        id: item.id,
        name: item.name,
        role: item.role ?? null,
        years: item.years ?? null,
        biography: item.biography ?? null,
        achievements: item.achievements ? item.achievements.join(', ') : null,
        imageUrl: item.imageUrl ?? null,
      }
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })