import React from "react";
import cn from "classnames";
import Moment from "react-moment";

export const TimelineCall = ({ event }) => {
  return (
    <div
      className={cn("timeline-item", event.eventType, {
        "event-dot": event.alarmEvent,
        "not-alarm-event": !event.alarmEvent,
      })}
    >
      <div
        className={cn("event-detail", {
          "not-alarm-event": !event.alarmEvent,
        })}
      >
        <div className="event-type-time">
          <p className="description abs-sf-icon">{event.eventDesc}</p>
          <i className="sf-icon i-connector line" />
          <Moment format="hh:mmA" className="time" local>
            {event.eventUtc}
          </Moment>
        </div>
        {event.callerNo && (
          <p className="a-comment">{`Number: ${event.callerNo}`}</p>
        )}
        {event.agentName && (
          <p className="actioned-by">{`Calling agent: ${event.agentName}`}</p>
        )}
        {event.callDuration ? (
          <p className="actioned-by">{`Duration: ${event.callDuration}`}</p>
        ) : null}
        {event.link && (
          <p className="actioned-by">
            <a
              href={event.link}
              rel="noopener noreferrer"
              target="_blank"
              className="video-feed-link"
            >
              Listen Call Recording
            </a>
          </p>
        )}
      </div>
    </div>
  );
};
