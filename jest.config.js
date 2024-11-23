export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },

  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^.+\\.svg$": "jest-transformer-svg",
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/src/__mocks__/fileMock.js"
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
