import faker from 'faker';
import { ILetter } from './types';

export function genFakeLetter(): ILetter {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email(firstName, lastName);
  const from = `${firstName} ${lastName} <${email}>`;

  return {
    id: faker.datatype.uuid(),
    date: faker.date.recent(90),
    from,
    subject: faker.lorem.sentence(),
    preview: faker.lorem.paragraphs(),
    isRead: faker.datatype.number(99) > 30,
    isDeleted: faker.datatype.number(99) > 90,
  };
}

export function genFakeLetters(count: number = faker.datatype.number(150)): ILetter[] {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error('count must be positive integer');
  }

  return Array(count).fill(0).map(genFakeLetter);
}

export function sortLettersByDateDesc(letter1: ILetter, letter2: ILetter): number {
  return letter2.date.getTime() - letter1.date.getTime();
}
