module.exports = async function uploadToAutoDS(products) {
  for (const product of products) {
    console.log(`📤 Uploading: ${product.title} (${product.link})`);
    // Simulate AutoDS upload logic here
  }
};