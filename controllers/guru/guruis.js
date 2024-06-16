import Guru from "../../models/guruModel.js";


// Create Guru
export const createGuru = async (req, res) => {
  const { name } = req.body;
  try {
    const guru = await Guru.create({ name });
    res.status(201).json(guru);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Read Guru
export const getGuru = async (req, res) => {
  try {
    const guru = await Guru.findAll();
    res.status(200).json(guru);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Guru
export const updateGuru = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const guru = await Guru.findByPk(id);
    if (!guru) return res.status(404).json({ message: "Guru not found" });
    guru.name = name;
    await guru.save();
    res.status(200).json(guru);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Guru
export const deleteGuru = async (req, res) => {
  const { id } = req.params;
  try {
    const guru = await Guru.findByPk(id);
    if (!guru) return res.status(404).json({ message: "Guru not found" });
    await guru.destroy();
    res.status(200).json({ message: "Guru deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
