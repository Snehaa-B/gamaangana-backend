import { Request, Response } from "express";
import * as bookingService from "../services/bookingService";
import * as eventService from "../services/eventService";
import * as userService from "../services/userService";
import { AuthRequest } from "../types";

export const getAllBookings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const status = req.query.status as string | undefined;
    const hallId = req.query.hallId
      ? parseInt(req.query.hallId as string)
      : undefined;

    if (req.isAdmin) {
      const bookings = await bookingService.findAll({
        status,
        hallId: hallId && !isNaN(hallId) ? hallId : undefined,
      });
      res.json({ success: true, data: bookings });
      return;
    }

    const firebaseUser = req.user!;
    const dbUser = await userService.findByEmail(firebaseUser.email!);

    if (!dbUser) {
      res.status(404).json({ success: false, message: "User not registered" });
      return;
    }

    const bookings =
      dbUser.role === "ADMIN"
        ? await bookingService.findAll({ status, hallId })
        : await bookingService.findByUserId(dbUser.id);

    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error("[bookingController.getAllBookings]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getBookingById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const booking = await bookingService.findById(id);

    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    console.error("[bookingController.getBookingById]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createBooking = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const firebaseUser = req.user!;
    const dbUser = await userService.findByEmail(firebaseUser.email!);

    if (!dbUser) {
      res.status(404).json({
        success: false,
        message: "User not registered. Call POST /api/auth/register first.",
      });
      return;
    }

    const { hallId, purpose, bookingDate } = req.body;

    if (!hallId || !purpose || !bookingDate) {
      res.status(400).json({
        success: false,
        message: "hallId, purpose, and bookingDate are required",
      });
      return;
    }

    const booking = await bookingService.createBooking({
      userId: dbUser.id,
      hallId: parseInt(hallId),
      purpose,
      bookingDate: new Date(bookingDate),
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "This hall is already booked for the selected date",
      });
      return;
    }
    console.error("[bookingController.createBooking]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateBookingStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.isAdmin) {
      res.status(403).json({ success: false, message: "Admin access required" });
      return;
    }

    const id = parseInt(req.params.id as string);
    const { status, eventTitle, eventDescription } = req.body;

    const validStatuses = ["PENDING", "APPROVED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: "status must be PENDING, APPROVED, or REJECTED",
      });
      return;
    }

    const booking = await bookingService.updateStatus(id, status);

    if (status === "APPROVED") {
      await eventService.createFromBooking({
        bookingId: booking.id,
        hallId: booking.hallId,
        title: eventTitle ?? booking.purpose,
        description: eventDescription ?? `Event for booking #${booking.id}`,
        eventDate: booking.bookingDate,
      });
    }

    res.json({
      success: true,
      message: `Booking ${status.toLowerCase()}`,
      data: booking,
    });
  } catch (error) {
    console.error("[bookingController.updateBookingStatus]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
