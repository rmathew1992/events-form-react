import React, { useEffect, useState } from 'react'
import { BandEventProps } from './types'
import DOMPurify from 'dompurify';


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

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  useEffect(() => {
  console.log("Updated orderItems:", orderItems);
}, [orderItems]);
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


  return (
    <div className="band-event-container">
      <div className="band-event-header">
        <h1>{event.name}</h1>
        <img src={event.imgUrl} alt={`${event.name} image`} />
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
              // onClick={() => removeTicket(index)}
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