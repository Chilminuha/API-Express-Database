const prisma = require('../config/prisma');

// GET /products - Menampilkan seluruh data
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil data', error: error.message });
  }
};

// GET /products/:id - Menampilkan detail data berdasarkan ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) }
    });

    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil data', error: error.message });
  }
};

// POST /products - Membuat data baru (dengan validasi)
const createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || price === undefined || price === null) {
      return res.status(400).json({ message: 'Nama dan harga produk wajib diisi' });
    }

    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: 'Harga harus berupa angka positif' });
    }

    const newProduct = await prisma.product.create({
      data: { name, price: Number(price) }
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menambah produk', error: error.message });
  }
};

// PUT /products - Mengupdate data yang ada (body menyertakan id)
const updateProduct = async (req, res) => {
  try {
    const { id, name, price } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID produk wajib disertakan dalam body' });
    }

    if (!name || price === undefined || price === null) {
      return res.status(400).json({ message: 'Nama dan harga produk wajib diisi' });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: Number(id) }
    });

    if (!existingProduct) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: { name, price: Number(price) }
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memperbarui produk', error: error.message });
  }
};

// DELETE /products/:id - Menghapus data berdasarkan ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await prisma.product.findUnique({
      where: { id: Number(id) }
    });

    if (!existingProduct) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    await prisma.product.delete({
      where: { id: Number(id) }
    });

    return res.status(200).json({ message: `Produk dengan ID ${id} berhasil dihapus` });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menghapus produk', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};