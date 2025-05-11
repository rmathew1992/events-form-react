# Welcome!

Thanks for taking the time to review my submission! The server can be started using `npm start`.

## What I would do with more time:

### Architecture Improvements
- **Break out components** for better separation of concerns:
  - Header component
  - Ticket details/form component  
  - Band description component
  - Right now most functionality lives in `TicketForm.tsx`, making it overwhelming

### Feature Enhancements
- **Enhance the ticket selector:**
  - Add direct number input (not just up/down arrows)
  - Better match the original design 

- **Improve band description handling:**
  - More thoughtful approach to user inputted descriptions
    - Currently we're displaying sanitized HTML without custom styling/formatting

### Design Polish
- **Match the original design more closely:**
  - Exact font specifications
  - Proper icon
  - More precisce/consistent spacing and layout
    - Extract out variables, to help with consistency

### Code Quality
- **Add comprehensive test coverage** - I wouldn't ship untested code to production
- **Implement proper security** - Credit card information shouldn't be sent willy nilly