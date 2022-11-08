import type {Request, Response, NextFunction} from 'express';
import moment from 'moment';
import {Types} from 'mongoose';
import EventCollection from './collection';

const isValidEventName = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.name.trim()) {
    res.status(400).json({
      error: 'Event name must not be empty.'
    });
    return;
  }

  next();
}

const isValidEventLocation = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.location.trim()) {
    res.status(400).json({
      error: 'Event location must not be empty.'
    });
    return;
  }

  next();
}

const isValidEventTime = async (req: Request, res: Response, next: NextFunction) => {
  const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');
  const result = formatDate(req.body.time);
  if (result === 'Invalid date') {
    res.status(400).json({
      error: 'Invalid date, use MM/DD/YY HH:MM:SS format.'
    });
    return;
  }

  next();
}

const isEventExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.eventId);
  const event = validFormat ? await EventCollection.findOne(req.params.eventId) : '';
  if (!event) {
    res.status(404).json({
      error: `Event with event ID ${req.params.eventId} does not exist.`
    });
    return;
  }

  next();
}

const isEventCreator = async (req: Request, res: Response, next: NextFunction) => {
  const event = await EventCollection.findOne(req.params.eventId);
  if (event.creator.toString() !== req.session.userId.toString()) {
    res.status(403).json({
      error: `You must be the event creator to perform this action.`
    });
    return;
  }

  next();
}

export {
  isValidEventName,
  isValidEventLocation,
  isValidEventTime,
  isEventExists,
  isEventCreator
}