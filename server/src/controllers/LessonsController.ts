import { Request, Response } from "express";
import sql from "../db";
import { Lesson } from "../types/Lesson";

export const getLessons = async (req: Request, res: Response) => {
  try {
    const { branch_code } = req.params;
    const lessons =
      await sql`SELECT * FROM lessons WHERE branch_code = ${branch_code} ORDER BY lesson_start`;
    res.status(200).json(lessons as Lesson[]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching lessons" });
  }
};

export const getLesson = async (req: Request, res: Response) => {
  try {
    const { branch_code, lesson_code } = req.params;
    const lesson =
      await sql`SELECT * FROM lessons WHERE lesson_code = ${lesson_code} AND branch_code = ${branch_code}`;
    res.status(200).json(lesson[0] as Lesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching lesson" });
  }
};

export const createLesson = async (req: Request, res: Response) => {
  try {
    const lesson = req.body as Lesson;
    const start = new Date(lesson.lesson_start);
    const end = new Date(lesson.lesson_end);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
      res.status(400).json({
        message: "Lesson start must be before lesson end",
      });
      return;
    }

    if (start < new Date()) {
      res.status(400).json({
        message: "Lesson start must be in the future",
      });
      return;
    }

    if (lesson.max_participants <= 0) {
      res.status(400).json({
        message: "Max participants must be greater than 0",
      });
      return;
    }

    const result = await sql`
      INSERT INTO lessons (
        lesson_code,
        branch_code,
        lesson_name,
        lesson_start,
        lesson_end,
        instructor,
        max_participants
      ) VALUES (
        ${lesson.lesson_code},
        ${lesson.branch_code},
        ${lesson.lesson_name},
        ${lesson.lesson_start},
        ${lesson.lesson_end},
        ${lesson.instructor},
        ${lesson.max_participants}
      )
      RETURNING *
    `;
    res.status(201).json(result[0] as Lesson);
  } catch (error: any) {
    console.error(error);
    if (error?.code === "23505") {
      res.status(409).json({
        message: `lesson_code ${req.body.lesson_code} already exists`,
      });
      return;
    }
    res.status(500).json({
      message: "Error creating lesson",
      error: error?.message ?? String(error),
    });
  }
};

export const updateLesson = async (req: Request, res: Response) => {
  try {
    const start = new Date(req.body.lesson_start);
    const end = new Date(req.body.lesson_end);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
      res.status(400).json({
        message: "Lesson start must be before lesson end",
      });
      return;
    }

    const lesson =
      await sql`UPDATE lessons SET lesson_name = ${req.body.lesson_name}, lesson_start = ${req.body.lesson_start}, lesson_end = ${req.body.lesson_end}, instructor = ${req.body.instructor}, max_participants = ${req.body.max_participants} WHERE lesson_code = ${req.params.lesson_code} AND branch_code = ${req.params.branch_code} RETURNING *`;

    res.status(200).json(lesson[0] as Lesson);
  } catch (error) {
    res.status(500).json({ message: "Error updating lesson" });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const lesson =
      await sql`DELETE FROM lessons WHERE lesson_code = ${req.params.lesson_code} AND branch_code = ${req.params.branch_code} RETURNING *`;
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: "Error deleting lesson" });
  }
};
