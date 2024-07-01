import ScanHistory from "../../models/barcodeModel.js";
// const { default: Kelas } = require("../../models/kelasModel");
import makanans from "../../models/makananModel.js";
import Users from "../../models/userModel.js";
import QRCode from "qrcode"

// Endpoint untuk memindai QR Code
export const pindaiQr = async (req, res) => {
    const { userId, makananId, description } = req.body;
    
    try {
      // Validasi data input
      const user = await Users.findByPk(userId);
      const makanan = await makanans.findByPk(makananId);
      
      if (!user || !makanan) {
        return res.status(404).json({ message: 'Student or Food not found' });
      }
      
      // Simpan hasil pemindaian ke dalam database
      const scanHistory = await ScanHistory.create({
        userId,
        makananId,
        description
      });
      
      res.status(201).json(scanHistory);
    } catch (error) {
      console.error("error scanning qr",error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  
  export const getLaporan = async (req, res) => {
    try {
        const reports = await ScanHistory.findAll({
          include: [
            { model: Users, as: 'user' },
            { model: makanans, as: 'makanan' },
          ]
        });

        // console.log('Reports:', reports); // Log untuk memeriksa data yang diambil

        
        const formattedReports = reports.map(report => ({
          description: report.description,
          foodName: report.makanan.name,
          studentUsername: report.user.username,
          scanDate: report.createdAt  // Asum  sikan scanDate merupakan createdAt dari ScanHistory
        }));

        // console.log('Formatted Reports:', formattedReports); // Log untuk memeriksa data yang diformat

        
        res.status(200).json(formattedReports);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
};

export const getLaporanByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const reports = await ScanHistory.findAll({
            where: { userId: userId },
            include: [
                { model: Users, as: 'user' },
                { model: makanans, as: 'makanan' },
            ]
        });

        if (reports.length === 0) {
            return res.status(404).json({ message: 'No reports found for this user' });
        }

        const formattedReports = reports.map(report => ({
            description: report.description,
            foodName: report.makanan.name,
            studentUsername: report.user.username,
            scanDate: report.createdAt
        }));

        res.status(200).json(formattedReports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createQr = async (req, res) => {
        try {
            const { userId, makananId } = req.body; // Pastikan nama properti di body sesuai dengan yang diakses di sini
            if (!userId || !makananId) {
                return res.status(400).json({ msg: "Invalid data" });
            }
    
            // Generate QR code data (this can be a URL or any data you want to encode in the QR code)
            const qrData = `studentId=${userId}&foodId=${makananId}`;
    
            // Generate QR code image
            const qrCode = await QRCode.toDataURL(qrData);
    
            res.json({ qrCode });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Server error" });
        }
}
    