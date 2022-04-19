import React from "react";
import "./contactDetail.css";
import ContegrisCall from "../VoipCall/ContegrisCall";


function ContactListItem({ intelliconUser, contact, mac, index, assignedAgent, showCallBtn }) {
  return (
    <div className="contact">
      <h3
        data-index={index + 1}
        className="abs-sf-icon name"
      >{`${contact.firstName} ${contact.lastName}`}</h3>
      <span className="number abs-sf-icon">
        {contact.phone}
        {showCallBtn && <ContegrisCall intelliconUser={intelliconUser} assignedAgent={assignedAgent} />}
        {/* <VoipCall mac={mac} number={contact.phone} /> */}
      </span>
      <span className="line" />
    </div>
  );
}

function ContactList({ intelliconUser, contacts, mac, assignedAgent, showCallBtn }) {

  return (
    <div className="detail-box">
      <h3>Contact Details</h3>
      {contacts.map((contact, i) => (
        <ContactListItem
          index={i}
          mac={mac}
          key={`k-${mac}-${i}-${contact.firstName}`}
          contact={contact}
          assignedAgent={assignedAgent}
          showCallBtn={showCallBtn}
          intelliconUser={intelliconUser}
        />
      ))}
    </div>
  );
}

const ContactDetail = ({ user, contacts, mac, assignedAgent, showCallBtn }) => {
  return <ContactList intelliconUser={user} mac={mac} contacts={contacts} assignedAgent={assignedAgent} showCallBtn={showCallBtn} />;
};

ContactDetail.propTypes = {};

export default ContactDetail;
