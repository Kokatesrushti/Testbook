// This file provides dummy implementations to avoid PostgreSQL dependency errors
// The application uses MongoDB exclusively as required

// Create dummy implementations
const dummyDb = {
  select: () => ({ 
    from: () => [],
    where: () => [] 
  }),
  insert: () => ({ 
    values: () => ({ 
      returning: () => [] 
    }) 
  }),
};

const dummyPool = {
  connect: () => ({}),
};

export const pool = dummyPool;
export const db = dummyDb;

console.log("Using MongoDB only - PostgreSQL connection bypassed");