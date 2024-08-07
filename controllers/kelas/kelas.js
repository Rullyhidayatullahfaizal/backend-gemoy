import Kelas from "../../models/kelasModel.js";
import Guru from "../../models/guruModel.js";
import Guruis from "../../models/guruModel.js";
import { Op } from "sequelize";

// Create Kelas
export const createKelas = async (req, res) => {
  const { nama_kelas, nama_walikelas } = req.body;

  try {
    // Cari ID dari guru berdasarkan nama
    const guru = await Guruis.findOne({ where: { name: nama_walikelas } });

    if (!guru) {
      return res.status(404).json({ message: "Nama wali kelas tidak ditemukan" });
    }

    // Cek apakah nama_walikelas sudah digunakan di kelas lain
    const existingKelas = await Kelas.findOne({ where: { nama_walikelas: guru.id } });

    if (existingKelas) {
      return res.status(400).json({ message: "Nama wali kelas sudah digunakan di kelas lain" });
    }

    // Jika belum, buat kelas baru
    const kelas = await Kelas.create({ nama_kelas, nama_walikelas: guru.id });

    res.status(201).json(kelas);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Read Kelas
export const getKelas = async (req, res) => {
  try {
    const kelas = await Kelas.findAll({ include: Guru });
    res.status(200).json(kelas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Kelas
export const updateKelas = async (req, res) => {
  const { id } = req.params;
  const { nama_kelas, nama_walikelas } = req.body;

  try {
    // Cari ID dari guru berdasarkan nama
    const guru = await Guruis.findOne({ where: { name: nama_walikelas } });

    if (!guru) {
      return res.status(404).json({ message: "Nama wali kelas tidak ditemukan" });
    }

    // Cek apakah nama_walikelas sudah digunakan di kelas lain, kecuali kelas dengan ID yang sedang diupdate
    const existingKelas = await Kelas.findOne({ 
      where: { 
        nama_walikelas: guru.id,
        id: { [Op.ne]: id }  // Op.ne means 'not equal'
      }
    });

    if (existingKelas) {
      return res.status(400).json({ message: "Nama wali kelas sudah digunakan di kelas lain" });
    }

    const kelas = await Kelas.findByPk(id);
    if (!kelas) {
      return res.status(404).json({ message: "Kelas tidak ditemukan" });
    }

    kelas.nama_kelas = nama_kelas;
    kelas.nama_walikelas = guru.id;  // Assign the found guru's ID
    await kelas.save();

    res.status(200).json(kelas);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Delete Kelas
export const deleteKelas = async (req, res) => {
  const { id } = req.params;
  try {
    const kelas = await Kelas.findByPk(id);
    if (!kelas) return res.status(404).json({ message: "Kelas not found" });
    await kelas.destroy();
    res.status(200).json({ message: "Kelas deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

