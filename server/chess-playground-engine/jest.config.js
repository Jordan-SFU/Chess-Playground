module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/test'],
    moduleFileExtensions: ['ts','js','json','node'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest'
    },
    verbose: true,
  };