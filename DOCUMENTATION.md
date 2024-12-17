# Book Club App Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Components](#components)
6. [Utilities](#utilities)
7. [Authentication](#authentication)
8. [External Integrations](#external-integrations)

## Project Overview

The Book Club App is a web application that allows users to create and join book clubs, discover new books, participate in discussions, and vote on book selections. It's built using Next.js 13 with the App Router, React, TypeScript, and integrates with various external APIs for book data and recommendations.

## Architecture

The application follows a client-server architecture using Next.js, which allows for both server-side rendering and API routes within the same project.

- **Frontend**: Next.js 13 with App Router, React, and TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS

## Database Schema

The database schema is defined using Prisma. Here's an overview of the main models:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatarUrl String?
  createdAt DateTime @default(now())
  clubs     ClubMember[]
  votes     PollVote[]
  annotations Annotation[]
}

model Club {
  id          String   @id @default(cuid())
  name        String
  description String?
  createdAt   DateTime @default(now())
  members     ClubMember[]
  polls       Poll[]
}

model ClubMember {
  id        String   @id @default(cuid())
  clubId    String
  userId    String
  role      String
  joinedAt  DateTime @default(now())
  club      Club     @relation(fields: [clubId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
}

model Poll {
  id           String   @id @default(cuid())
  clubId       String
  title        String
  description  String?
  votingMethod String
  status       String
  createdAt    DateTime @default(now())
  closedAt     DateTime?
  club         Club     @relation(fields: [clubId], references: [id])
  options      PollOption[]
  votes        PollVote[]
}

model PollOption {
  id              String @id @default(cuid())
  pollId          String
  bookIdentifier  String
  displayName     String
  poll            Poll   @relation(fields: [pollId], references: [id])
  votes           PollVote[]
}

model PollVote {
  id         String @id @default(cuid())
  pollId     String
  userId     String
  optionId   String
  votingData Json
  poll       Poll   @relation(fields: [pollId], references: [id])
  user       User   @relation(fields: [userId], references: [id])
  option     PollOption @relation(fields: [optionId], references: [id])
}

model Book {
  id           String   @id @default(cuid())
  title        String
  authors      String[]
  description  String?
  coverUrl     String?
  locations    Json?
  source       String
  publicDomain Boolean  @default(false)
  createdAt    DateTime @default(now())
  annotations  Annotation[]
  aiInsights   AIInsight?
}

model Annotation {
  id            String @id @default(cuid())
  clubId        String
  userId        String
  bookId        String
  textLocation  String
  annotationText String
  createdAt     DateTime @default(now())
  user          User   @relation(fields: [userId], references: [id])
  book          Book   @relation(fields: [bookId], references: [id])
}

model LiteraryNetworkCache {
  id            String @id @default(cuid())
  sourceBookId  String @unique
  relatedData   Json
  fetchedAt     DateTime @default(now())
}

model AIInsight {
  id                 String @id @default(cuid())
  bookId             String @unique
  summary            String?
  themes             Json?
  discussionQuestions Json?
  fetchedAt          DateTime @default(now())
  book               Book    @relation(fields: [bookId], references: [id])
}
```
