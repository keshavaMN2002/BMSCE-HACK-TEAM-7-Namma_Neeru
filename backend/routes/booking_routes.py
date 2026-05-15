from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.booking import Booking, BookingStatus, PaymentStatus
from schemas.booking_schema import BookingCreate, BookingResponse
from typing import List

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("", status_code=status.HTTP_201_CREATED)
def create_booking(booking_data: BookingCreate, db: Session = Depends(get_db)):
    try:
        new_booking = Booking(
            customer_name=booking_data.customer_name,
            mobile_number=booking_data.mobile_number,
            detailed_address=booking_data.detailed_address,
            water_capacity=booking_data.water_capacity,
            payment_amount=booking_data.payment_amount,
            payment_status=PaymentStatus.pending,
            booking_status=BookingStatus.pending
        )
        
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)
        
        return {
            "message": "Booking created successfully",
            "booking_id": new_booking.id
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create booking: {str(e)}")

@router.get("/pending", response_model=List[BookingResponse])
def get_pending_bookings(db: Session = Depends(get_db)):
    try:
        bookings = db.query(Booking).filter(Booking.booking_status == BookingStatus.pending).all()
        return bookings
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch pending bookings: {str(e)}")

@router.put("/{booking_id}/accept")
def accept_booking(booking_id: int, db: Session = Depends(get_db)):
    try:
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
            
        booking.booking_status = BookingStatus.accepted
        db.commit()
        
        return {"message": "Booking accepted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to accept booking: {str(e)}")

@router.put("/{booking_id}/reject")
def reject_booking(booking_id: int, db: Session = Depends(get_db)):
    try:
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
            
        booking.booking_status = BookingStatus.rejected
        db.commit()
        
        return {"message": "Booking rejected successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to reject booking: {str(e)}")
