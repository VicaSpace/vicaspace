import { PrismaClient } from '@prisma/client';
import { sha256 } from 'js-sha256';

import { getRandomString } from '../src/services/auth';

async function createUsers() {
  let salt = getRandomString(50);
  const richard = await prisma.user.upsert({
    where: { username: 'richard' },
    update: {},
    create: {
      username: 'richard',
      spaceId: 1,
      salt: salt,
      hashedPassword: sha256('password' + salt),
    },
  });
  salt = getRandomString(50);
  const minh = await prisma.user.upsert({
    where: { username: 'minh' },
    update: {},
    create: {
      username: 'minh',
      spaceId: 1,
      salt: salt,
      hashedPassword: sha256('password' + salt),
    },
  });
  console.log({ richard, minh });
}

const prisma = new PrismaClient();

async function createSpaces() {
  const hochiminh = await prisma.space.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Ho Chi Minh',
      latitude: 10.762622,
      longitude: 106.660172,
      startTime: new Date('2022-10-10T23:50:21.817Z'),
      serverTime: new Date('2020-10-10T23:50:21.817Z'),
      pomodoroDuration: 1500,
      shortBreakDuration: 300,
      longBreakDuration: 1800,
      urlVideo: 'https://www.youtube.com/watch?v=HbHAMzv1bUs',
      urlSpotify: '',
    },
  });
  const hanoi = await prisma.space.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Ha Noi',
      latitude: 21.033333,
      longitude: 105.849998,
      startTime: new Date('2022-10-10T23:50:21.817Z'),
      serverTime: new Date('2020-10-10T23:50:21.817Z'),
      pomodoroDuration: 1500,
      shortBreakDuration: 300,
      longBreakDuration: 1800,
      urlVideo: 'https://www.youtube.com/watch?v=NtaQfZ1Jaf0',
      urlSpotify: '',
    },
  });
  console.log({ hochiminh, hanoi });
}

async function main() {
  await createSpaces();
  await createUsers();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
