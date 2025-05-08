import React, { useEffect, useState } from 'react'
import DOMPurify from 'dompurify';
import { BandEvent } from './types';

export interface BandEventProps {
  event: BandEvent
}

const formatCurrency = (amount: number): string => {
  return `$${(amount / 100).toFixed(2)}`
}

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

interface OrderItem {
  ticketType: string;
  quantity: number;
}

const TicketForm: React.FC<BandEventProps> = ({ event }) => {
  const sanitizedDescriptionBlurb = DOMPurify.sanitize(event.description_blurb);
  const downArrowhead = '\u2304';

  const [orderItems, setOrderItems] = useState<OrderItem[]>([])

  const calculateTotalPrice = (): number => {
    return orderItems.reduce((total, item) => {
      const ticketType = event.ticketTypes.find(t => t.type === item.ticketType)
      return total + (ticketType ? ticketType.cost * item.quantity : 0)
    }, 0)
  }

  const addOrUpdateTicket = (ticketType: string) => {
    const existingTicketIndex = orderItems.findIndex(item => item.ticketType === ticketType)

    if (existingTicketIndex >= 0) {
      const updatedOrderItems = [...orderItems]
      updatedOrderItems[existingTicketIndex].quantity += 1
      setOrderItems(updatedOrderItems)
    } else {
      setOrderItems([
        ...orderItems,
        { ticketType: ticketType, quantity: 1 }
      ])
    }
  }

  const removeTicket = (ticketType: string) => {
    const existingTicketIndex = orderItems.findIndex(item => item.ticketType === ticketType)
    const updatedOrderItems = [...orderItems]

    if (existingTicketIndex === -1) {
      return
    } else if (updatedOrderItems[existingTicketIndex].quantity <= 1) {
      updatedOrderItems.splice(existingTicketIndex, 1)
      setOrderItems(updatedOrderItems)
    } else {
      updatedOrderItems[existingTicketIndex].quantity -= 1
      setOrderItems(updatedOrderItems)
    }
  }

  useEffect(() => {
    console.log("Updated orderItems:", orderItems)
  }, [orderItems])


  return (
    <div className="band-event-container">
      <div className="band-event-header">
        <h1>{event.name}</h1>
        <img src={event.imgUrl} alt={`${event.name} image`} />
      </div>
      <div className="order-total">
        <strong>Total:</strong> {formatCurrency(calculateTotalPrice())}
      </div>

      <div className="band-event-info">
        <div className="event-metadata">
          <p className="event-date">
            <strong>Date:</strong> {formatDate(event.date)}
          </p>
          <p className="event-location">
            <strong>Location:</strong> {event.location}
          </p>
        </div>

        <div
          className="event-description"
          dangerouslySetInnerHTML={{ __html: sanitizedDescriptionBlurb }}
        />
      </div>

      <div className="ticket-options">
        <h2>Ticket Options</h2>
        {event.ticketTypes.map((ticket, index) => (
          <div key={`${event.id}-${ticket.type}`} className="ticket-option">
            <h3>{ticket.name}</h3>
            <p className="ticket-description">{ticket.description}</p>
            <p className="ticket-price">{formatCurrency(ticket.cost)}</p>
            <button
              type="button"
              className="remove-ticket-btn"
              onClick={() => addOrUpdateTicket(ticket.type)}
            >
              ^
            </button>
            <button
              type="button"
              className="remove-ticket-btn"
              onClick={() => removeTicket(ticket.type)}
            >
              {downArrowhead}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TicketForm