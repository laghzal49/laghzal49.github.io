import express from "express";
import projects from "../data/projects.js";
import skills from "../data/skills.js";

const router = express.Router();

// Get all projects
router.get("/", (req, res) => {
  res.json({
    success: true,
    data: projects,
    total: projects.length
  });
});

// Get single project
router.get("/:id", (req, res) => {
  const project = projects.find(p => p.id === parseInt(req.params.id));
  
  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found"
    });
  }

  res.json({
    success: true,
    data: project
  });
});

// Get projects by status
router.get("/status/:status", (req, res) => {
  const filtered = projects.filter(p => p.status === req.params.status);
  
  res.json({
    success: true,
    data: filtered,
    total: filtered.length
  });
});

// Get skills
router.get("/me/skills", (req, res) => {
  res.json({
    success: true,
    data: skills
  });
});

export default router;
