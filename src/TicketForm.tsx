import React, { useEffect, useState } from "react"
import DOMPurify from "dompurify"
import { BandEvent } from "./types"

export interface BandEventProps {
  event: BandEvent
}

const formatCurrency = (amount: number): string => {
  return `$${(amount / 100).toFixed(2)}`
}

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

interface OrderItem {
  ticketType: string
  quantity: number
}

interface CustomerInfo {
  firstName: string
  lastName: string
  address: string
  creditCardNumber: string
  expiryDate: string
  cvv: string
}

const TicketForm: React.FC<BandEventProps> = ({ event }) => {
  const sanitizedDescriptionBlurb = DOMPurify.sanitize(event.description_blurb)
  const downArrowhead = "\u2304" 

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]) 
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    address: "",
    creditCardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  const calculateTotalPrice = (): number => {
    return orderItems.reduce((total, item) => {
      const ticketType = event.ticketTypes.find(
        (t) => t.type === item.ticketType
      )
      return total + (ticketType ? ticketType.cost * item.quantity : 0)
    }, 0)
  }

  const addOrUpdateTicket = (ticketType: string) => {
    const existingTicketIndex = orderItems.findIndex(
      (item) => item.ticketType === ticketType
    )

    if (existingTicketIndex >= 0) {
      const updatedOrderItems = [...orderItems]
      updatedOrderItems[existingTicketIndex].quantity += 1
      setOrderItems(updatedOrderItems)
    } else {
      setOrderItems([...orderItems, { ticketType: ticketType, quantity: 1 }])
    }
  }

  const removeTicket = (ticketType: string) => {
    const existingTicketIndex = orderItems.findIndex(
      (item) => item.ticketType === ticketType
    )
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerInfo(prevInfo => ({
      ...prevInfo,
      [name]: value
    }))
  }

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (orderItems.length === 0) {
      alert("Please select at least one ticket.");
      return;
    }
    
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.address) {
      alert("Please fill in all required customer information fields.");
      return;
    }
    
    if (!customerInfo.creditCardNumber || !customerInfo.expiryDate || !customerInfo.cvv) {
      alert("Please fill in all required payment details.");
      return;
    }
    
    // Calculate ticket totals by type
    const ticketsByType = orderItems.map(item => {
      return {
        type: item.ticketType,
        quantity: item.quantity,
      }
    })
    
    // Create the complete order object
    const orderData = {
      customer: {
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        address: customerInfo.address,
        // Definitely shouldn't be sending credit card numbers willy nilly
        paymentMethod: {
          creditCard: customerInfo.creditCardNumber,
          expiryDate: customerInfo.expiryDate,
          cvv: customerInfo.cvv
        }
      },
      event: {
        id: event.id,
        name: event.name,
        date: event.date,
        location: event.location
      },
      ticketsByType: ticketsByType
    };
    
    // Log the order data (in a real app, you would send this to a server)
    console.log("Order Submitted:", orderData);
  }

  useEffect(() => {
    console.log("Updated orderItems:", orderItems)
  }, [orderItems])

  return (
    <div className="band-event-container">
      <div className="band-event-header">
        <h1>{event.name}</h1>
        <div className="event-metadata">
          <p className="event-date">
            <span style={{ fontSize: "24px", marginRight: "5px" }}>📅</span> {formatDate(event.date)}
          </p>
          <p className="event-location">
            <span style={{ fontSize: "24px", marginRight: "5px" }}>📍</span> {event.location}
          </p>
        </div>
      </div>
      
      <div className="band-event-details">
        <div className="band-event-info">
          <img src={event.imgUrl} alt={`${event.name}`} />
          <div
            className="event-description"
            dangerouslySetInnerHTML={{ __html: sanitizedDescriptionBlurb }}
          />
        </div>

        <div className="ticket-options">
          <h2>Select Tickets</h2>
          {event.ticketTypes.map((ticket, index) => (
            <>
              <div key={`${event.id}-${ticket.type}`} className="ticket-option">
                <div>
                  <h3>{ticket.name.toUpperCase()}</h3>
                  <p className="ticket-description">{ticket.description}</p>
                  <p className="ticket-price">{formatCurrency(ticket.cost)}</p>
                </div>
                <div className="ticket-selection-container">
                  <p className="ticket-qty">{orderItems.find(item => item.ticketType === ticket.type)?.quantity || 0}</p>
                  <div>
                    <button
                      type="button"
                      className="ticket-btn add-ticket-btn"
                      onClick={() => addOrUpdateTicket(ticket.type)}
                    >
                      ^
                    </button>
                    <button
                      type="button"
                      className="ticket-btn remove-ticket-btn"
                      onClick={() => removeTicket(ticket.type)}
                    >
                      {downArrowhead}
                    </button>
                  </div>
                </div>
              </div>
              <hr />
            </>
          ))}
          <div>
            <div className="order-total">
              <h3>TOTAL</h3> 
              <p>
                {formatCurrency(calculateTotalPrice())}
              </p>
            </div>
            <div className="order-details-sub-container">
                <input
                  type="text"
                  className="input-half"
                  name="firstName"
                  placeholder="First Name"
                  value={customerInfo.firstName}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  className="input-half"
                  name="lastName"
                  placeholder="Last Name"
                  value={customerInfo.lastName}
                  onChange={handleInputChange}
                />
              <input
                type="text"
                className="input-full"
                name="address"
                placeholder="Address"
                value={customerInfo.address}
                onChange={handleInputChange}
              />
            </div>
            <p> <strong>Payment Details</strong> </p>
            <div className="order-details-sub-container">
              <input
                type="text"
                className="input-full"
                name="creditCardNumber"
                value={customerInfo.creditCardNumber}
                placeholder="0000 0000 0000 0000"
                onChange={handleInputChange}
              />

              <input
                type="text"
                className="input-half"
                name="expiryDate"
                value={customerInfo.expiryDate}
                placeholder="MM/YY"
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="cvv"
                className="input-half"
                value={customerInfo.cvv}
                placeholder="CVV"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button onClick={handleSubmit} className="get-tickets-btn">Get Tickets</button>
        </div>
      </div>
    </div>
  )
}

export default TicketForm
