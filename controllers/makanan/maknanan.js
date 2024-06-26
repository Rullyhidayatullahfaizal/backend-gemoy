import Makanan from "../../models/makananModel.js";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();


export const getMakanan = async (req, res) => {
  
  try {
    const makanan = await Makanan.findAll();
    res.json(makanan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMakananById = async (req, res) => {
  try {
    const makanan = await Makanan.findByPk(req.params.id);
    if (!makanan) return res.status(404).json({ message: "Makanan not found" });
    res.json(makanan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMakanan = async (req, res) => {
  const { name, description, price, start_date, end_date } = req.body;
  const image = req.file.path;
  try {
    const newMakanan = await Makanan.create({
      name, image, description, price, start_date, end_date
    });
    res.status(201).json(newMakanan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMakanan = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, start_date, end_date } = req.body;
  const newImage = req.file ? req.file.path : null;

  try {
    const makanan = await Makanan.findByPk(id);
    if (!makanan) {
      return res.status(404).json({ message: "Makanan not found" });
    }

    const oldImage = makanan.image;

    if (newImage && oldImage) {
      // Check if the file exists before trying to delete
      if (fs.existsSync(oldImage)) {
        fs.unlinkSync(oldImage);  // Delete the old image file
      }
    }

    makanan.name = name || makanan.name;
    makanan.description = description || makanan.description;
    makanan.price = price || makanan.price;
    makanan.start_date = start_date || makanan.start_date;
    makanan.end_date = end_date || makanan.end_date;
    makanan.image = newImage || makanan.image;

    await makanan.save();

    res.status(200).json(makanan);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteMakanan = async (req, res) => {
  const { id } = req.params;

  try {
    const makanan = await Makanan.findByPk(id);
    if (!makanan) {
      return res.status(404).json({ message: "Makanan not found" });
    }

    const imagePath = makanan.image;

    // Check if the file exists before trying to delete
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);  // Delete the image file
    }

    await Makanan.destroy({
      where: { id: id }
    });

    res.status(200).json({ message: "Makanan deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
