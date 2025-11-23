import { faker } from '@faker-js/faker';

/**
 * Data Generator using Faker library for dynamic test data
 */
export class DataGenerator {
  /**
   * Generate random user data
   */
  static generateUser() {
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12, memorable: false }),
      phone: faker.phone.number(),
      address: faker.address.streetAddress(),
      city: faker.address.city(),
      country: faker.address.country(),
    };
  }

  /**
   * Generate random product data
   */
  static generateProduct() {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      quantity: faker.number.int({ min: 1, max: 100 }),
      sku: faker.string.alphaNumeric(8).toUpperCase(),
    };
  }

  /**
   * Generate random company data
   */
  static generateCompany() {
    return {
      name: faker.company.name(),
      website: faker.internet.url(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.address.streetAddress(),
    };
  }

  /**
   * Generate random article data
   */
  static generateArticle() {
    return {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(3),
      author: faker.name.fullName(),
      category: faker.word.noun(),
      publishedDate: faker.date.past(),
    };
  }

  /**
   * Generate random search queries
   * @param count - Number of queries to generate
   */
  static generateSearchQueries(count: number = 5): string[] {
    const queries: string[] = [];
    for (let i = 0; i < count; i++) {
      queries.push(faker.word.words(faker.number.int({ min: 1, max: 3 })).join(' '));
    }
    return queries;
  }

  /**
   * Generate random email
   */
  static generateEmail(): string {
    return faker.internet.email();
  }

  /**
   * Generate random phone number
   */
  static generatePhoneNumber(): string {
    return faker.phone.number();
  }

  /**
   * Generate random string
   * @param length - String length
   */
  static generateRandomString(length: number = 10): string {
    return faker.string.alphaNumeric(length);
  }

  /**
   * Generate random number
   * @param min - Minimum number
   * @param max - Maximum number
   */
  static generateRandomNumber(min: number = 1, max: number = 100): number {
    return faker.number.int({ min, max });
  }

  /**
   * Generate future date
   * @param years - Years from now
   */
  static generateFutureDate(years: number = 1): Date {
    return faker.date.future({ years });
  }

  /**
   * Generate past date
   * @param years - Years ago
   */
  static generatePastDate(years: number = 1): Date {
    return faker.date.past({ years });
  }
}
