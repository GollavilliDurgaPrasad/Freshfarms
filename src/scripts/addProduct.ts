import { addOrganicCarrots } from '../lib/addProduct';

const run = async () => {
  console.log('Adding Organic Carrots to the database...');
  const result = await addOrganicCarrots();
  
  if (result) {
    console.log('Successfully added Organic Carrots to the database!');
  } else {
    console.log('Failed to add Organic Carrots to the database.');
  }
};

run(); 