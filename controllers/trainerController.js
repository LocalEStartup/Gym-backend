import fs from "fs";
import path from "path";
import Trainer from "../models/Trainer.js";

const uploadsDir = path.resolve("uploads");

//  Add trainer
export const addTrainer = (req, res) => {
  const { trainername, experience, services, timing, fees } = req.body;
  const image = req.file ? req.file.filename : null;

  Trainer.create({ trainername, experience, services, timing, fees, image }, (err, trainer) => {
    if (err) {
      console.error("❌ Error inserting trainer:", err);
      return res.status(500).json({ error: err.sqlMessage || "Database error" });
    }
    res.json({ message: "✅ Trainer added", trainer });
  });
};

// ✅ Get all trainers
export const getTrainers = (req, res) => {
  Trainer.getAll((err, trainers) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(trainers);
  });
};

// ✅ Get trainer by ID
export const getTrainerById = (req, res) => {
  const { id } = req.params;

  Trainer.getById(id, (err, trainer) => {
    if (err) {
      console.error("❌ Error fetching trainer:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }
    res.json(trainer);
  });
};

// ✅ Toggle active
export const toggleActive = (req, res) => {
  const { id } = req.params;
  Trainer.getById(id, (err, trainer) => {
    if (err || !trainer) return res.status(404).json({ error: "Trainer not found" });

    const nextActive = trainer.active === 1 ? 0 : 1;
    Trainer.setActive(id, nextActive, (err2) => {
      if (err2) return res.status(500).json({ error: "Database error" });
      res.json({
        message: nextActive ? "✅ Trainer activated" : "🚫 Trainer deactivated",
        active: nextActive,
      });
    });
  });
};

// ✅ Update trainer
export const updateTrainer = (req, res) => {
  const { id } = req.params;
  const { trainername, experience, services, timing, fees } = req.body;
  const newImage = req.file ? req.file.filename : null;

  Trainer.getById(id, (err, existing) => {
    if (err || !existing) return res.status(404).json({ error: "Trainer not found" });

    // Delete old image if replaced
    if (newImage && existing.image) {
      const oldPath = path.join(uploadsDir, existing.image);
      fs.unlink(oldPath, (uErr) => {
        if (uErr && uErr.code !== "ENOENT") {
          console.error("❌ Failed to remove old file:", uErr);
        }
      });
    }

    Trainer.update(
      id,
      { trainername, experience, services, timing, fees, image: newImage || undefined },
      (uErr) => {
        if (uErr) return res.status(500).json({ error: "Database error" });
        res.json({ message: "✅ Trainer updated successfully" });
      }
    );
  });
};

// ✅ Permanent delete
export const deleteTrainerPermanent = (req, res) => {
  const { id } = req.params;

  Trainer.getById(id, (err, trainer) => {
    if (err || !trainer) return res.status(404).json({ error: "Trainer not found" });

    // Delete image if exists
    if (trainer.image) {
      const filePath = path.join(uploadsDir, trainer.image);
      fs.unlink(filePath, (uErr) => {
        if (uErr && uErr.code !== "ENOENT") {
          console.error("❌ File delete error:", uErr);
        }
      });
    }

    Trainer.delete(id, (dErr) => {
      if (dErr) return res.status(500).json({ error: "Database error" });
      res.json({ message: "🗑️ Trainer permanently deleted" });
    });
  });
};
