import { PrismaClient } from '@prisma/client';
import { sha256 } from 'js-sha256';

const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function getRandomString(length: number) {
  let result = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function createUsers() {
  let salt = getRandomString(50);
  await prisma.user.upsert({
    where: { username: 'richard' },
    update: {},
    create: {
      username: 'richard',
      spaceId: 1,
      salt: salt,
      hashedPassword: sha256(sha256('password' + salt) + process.env.PEPPER),
      socketId: 'fL5-V5o_a7PK4ajJAAAd',
    },
  });
  salt = getRandomString(50);
  await prisma.user.upsert({
    where: { username: 'minh' },
    update: {},
    create: {
      username: 'minh',
      spaceId: 1,
      salt: salt,
      hashedPassword: sha256(sha256('password' + salt) + process.env.PEPPER),
      socketId: 'fL5-V5o_a7PK4ajJAAAd',
    },
  });
  salt = getRandomString(50);
  await prisma.user.upsert({
    where: { username: 'chau' },
    update: {},
    create: {
      username: 'chau',
      spaceId: 1,
      salt: salt,
      hashedPassword: sha256(sha256('password' + salt) + process.env.PEPPER),
      socketId: 'fL5-V5o_a7PK4ajJAAAd',
    },
  });
  salt = getRandomString(50);
  await prisma.user.upsert({
    where: { username: 'trungngo' },
    update: {},
    create: {
      username: 'trungngo',
      spaceId: 1,
      salt: salt,
      hashedPassword: sha256(sha256('password' + salt) + process.env.PEPPER),
      socketId: 'fL5-V5o_a7PK4ajJAAAd',
    },
  });
  salt = getRandomString(50);
  await prisma.user.upsert({
    where: { username: 'long' },
    update: {},
    create: {
      username: 'long',
      spaceId: 1,
      salt: salt,
      hashedPassword: sha256(sha256('password' + salt) + process.env.PEPPER),
      socketId: 'fL5-V5o_a7PK4ajJAAAd',
    },
  });
  salt = getRandomString(50);
  await prisma.user.upsert({
    where: { username: 'tan' },
    update: {},
    create: {
      username: 'tan',
      spaceId: 1,
      salt: salt,
      hashedPassword: sha256(sha256('password' + salt) + process.env.PEPPER),
      socketId: 'fL5-V5o_a7PK4ajJAAAd',
    },
  });
  salt = getRandomString(50);
  await prisma.user.upsert({
    where: { username: 'kien' },
    update: {},
    create: {
      username: 'kien',
      spaceId: 1,
      salt: salt,
      hashedPassword: sha256(sha256('password' + salt) + process.env.PEPPER),
      socketId: 'fL5-V5o_a7PK4ajJAAAd',
    },
  });
  salt = getRandomString(50);
  await prisma.user.upsert({
    where: { username: 'toan' },
    update: {},
    create: {
      username: 'toan',
      spaceId: 1,
      salt: salt,
      hashedPassword: sha256(sha256('password' + salt) + process.env.PEPPER),
      socketId: 'fL5-V5o_a7PK4ajJAAAd',
    },
  });
  salt = getRandomString(50);
  await prisma.user.upsert({
    where: { username: 'hai' },
    update: {},
    create: {
      username: 'hai',
      spaceId: 1,
      salt: salt,
      hashedPassword: sha256(sha256('password' + salt) + process.env.PEPPER),
      socketId: 'fL5-V5o_a7PK4ajJAAAd',
    },
  });
  salt = getRandomString(50);
  await prisma.user.upsert({
    where: { username: 'hung' },
    update: {},
    create: {
      username: 'hung',
      spaceId: 1,
      salt: salt,
      hashedPassword: sha256(sha256('password' + salt) + process.env.PEPPER),
      socketId: 'fL5-V5o_a7PK4ajJAAAd',
    },
  });
  salt = getRandomString(50);
  await prisma.user.upsert({
    where: { username: 'binh' },
    update: {},
    create: {
      username: 'binh',
      spaceId: 1,
      salt: salt,
      hashedPassword: sha256(sha256('password' + salt) + process.env.PEPPER),
      socketId: 'fL5-V5o_a7PK4ajJAAAd',
    },
  });
}

const prisma = new PrismaClient();

async function createSpaces() {
  await prisma.space.upsert({
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
      timezone: 'Asia/Bangkok',
    },
  });
  await prisma.space.upsert({
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
      timezone: 'Asia/Bangkok',
    },
  });
}

async function main() {
  await createSpaces();
  await createUsers();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .catch(async (_err) => {
    await prisma.$disconnect();
    process.exit(1);
  });
