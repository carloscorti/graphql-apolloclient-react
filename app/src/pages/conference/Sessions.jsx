import React, { useState } from "react";
import "./style-sessions.css";
import { Link } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import { gql, useQuery, useMutation } from "@apollo/client";

const SESSION_ATTRIBUTES = gql`
  fragment SessionInfo on Session {
    id
    title
    day
    room
    level
    startsAt
    description @include(if: $isDescription)
    speakers {
      id
      name
    }
  }
`;

const CREATE_SESSION = gql`
  mutation createSession($newSession: SessionInput!) {
    createSession(session: $newSession) {
      id
      title
    }
  }
`;

const ALL_SESSIONS = gql`
  query sessions($isDescription: Boolean!) {
    sessions {
      ...SessionInfo
    }
  }
  ${SESSION_ATTRIBUTES}
`;

const SESSIONS = gql`
  query sessions($day: String!, $isDescription: Boolean!) {
    intro: sessions(day: $day, level: "Introductory and overview") {
      ...SessionInfo
    }
    intermediate: sessions(day: $day, level: "Intermediate") {
      ...SessionInfo
    }
    advanced: sessions(day: $day, level: "Advanced") {
      ...SessionInfo
    }
  }
  ${SESSION_ATTRIBUTES}
`;

function AllSessionList() {
  const isDescription = true;

  const { loading, error, data } = useQuery(ALL_SESSIONS, {
    variables: { isDescription },
  });

  if (loading) return <p>Loading Sessions...</p>;

  if (error) return <p>Error Loading Sessions...</p>;

  return data.sessions.map((session) => (
    <SessionItem key={session.id} session={{ ...session }} />
  ));
}

function SessionList({ day }) {
  const isDescription = true;

  const { loading, error, data } = useQuery(SESSIONS, {
    variables: { day, isDescription },
  });

  if (loading) return <p>Loading Sessions...</p>;

  if (error) return <p>Error Loading Sessions...</p>;

  const { intro, intermediate, advanced } = data;

  return [intro, intermediate, advanced].map((sessions) =>
    sessions.map((session) => (
      <SessionItem key={session.id} session={{ ...session }} />
    ))
  );
}

function SessionItem({ session }) {
  const {
    id,
    title,
    level,
    day,
    room,
    startsAt,
    description,
    speakers,
  } = session;

  return (
    <div key={id} className="col-xs-12 col-sm-6" style={{ padding: 5 }}>
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{title}</h3>
          <h5>{`Level: ${level}`}</h5>
        </div>
        <div className="panel-body">
          <h5>{`Day: ${day}`}</h5>
          <h5>{`Room Number: ${room}`}</h5>
          <h5>{`Starts at: ${startsAt}`}</h5>
          {description && <h5>{`Description: ${description}`}</h5>}
        </div>
        <div className="panel-footer">
          {speakers.map(({ id, name }) => (
            <span key={id} style={{ padding: 2 }}>
              <Link
                className="btn btn-default btn-lg"
                to={`/conference/speaker/${id}`}
              >
                View {name}'s Profile
              </Link>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Sessions() {
  const [day, setDay] = useState("All");
  return (
    <>
      <section className="banner">
        <div className="container">
          <div className="row" style={{ padding: 10 }}>
            <Link
              className="btn btn-lg center-block"
              to={`/conference/sessions/new`}
            >
              Submit a Session!
            </Link>
          </div>
          <div className="row">
            <button
              type="button"
              onClick={() => setDay("All")}
              className="btn-oval"
            >
              All Sessions
            </button>
            <button
              type="button"
              onClick={() => setDay("Wednesday")}
              className="btn-oval"
            >
              Wednesday
            </button>
            <button
              type="button"
              onClick={() => setDay("Thursday")}
              className="btn-oval"
            >
              Thursday
            </button>
            <button
              type="button"
              onClick={() => setDay("Friday")}
              className="btn-oval"
            >
              Friday
            </button>
          </div>
          {day !== "All" && <SessionList day={day} />}
          {day === "All" && <AllSessionList />}
        </div>
      </section>
    </>
  );
}

export function SessionForm() {
  const isDescription = true;

  const updateCache = (cache, { data: { createSession } }) => {
    // OPTION TO UPDATE ONLY ONE QUERY
    // console.log(cache);
    // console.log(createSession);
    // const cacheData = cache.readQuery({
    //   query: ALL_SESSIONS,
    //   variables: { isDescription },
    // });
    // console.log(cacheData);
    // cache.writeQuery({
    //   query: ALL_SESSIONS,
    //   variables: { isDescription },
    //   data: {
    //     sessions: [...cacheData.sessions, createSession],
    //   },
    // });

    cache.modify({
      fields: {
        sessions(existingSessions = []) {
          const newSession = createSession;
          cache.writeQuery({
            query: ALL_SESSIONS,
            data: { newSession, ...existingSessions },
          });

          // OPTION 1
          // const newSession = cache.writeFragment({
          //   data: createSession,
          //   fragment: SESSION_ATTRIBUTES,
          // });
          // const newSession = cache.writeFragment({
          //   data: createSession,
          //   fragment: gql`
          //     fragment NewSession on Session {
          //       id
          //       title
          //     }
          //   `,
          // });
          // console.log(newSession);
          // return [...existingSessions, newSession];

          // OPTION 2
          // return [...existingSessions, createSession];
        },
      },
    });
  };

  const [createSession, { called, error }] = useMutation(CREATE_SESSION, {
    update: updateCache,
  });

  if (called) return <p>Session saved correctly</p>;

  if (error) return <p>Error Creating Sessions...</p>;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        padding: 10,
      }}
    >
      <Formik
        initialValues={{
          title: "",
          description: "",
          day: "",
          level: "",
        }}
        onSubmit={async (values) => {
          await createSession({
            variables: { newSession: values },
          });
        }}
      >
        {() => (
          <Form style={{ width: "100%", maxWidth: 500 }}>
            <h3 className="h3 mb-3 font-weight-normal">Submit a Session!</h3>
            <div className="mb-3" style={{ paddingBottom: 5 }}>
              <label htmlFor="inputTitle">Title</label>
              <Field
                id="inputTitle"
                className="form-control"
                required
                autoFocus
                name="title"
              />
            </div>
            <div className="mb-3" style={{ paddingBottom: 5 }}>
              <label htmlFor="inputDescription">Description</label>
              <Field
                type="textarea"
                id="inputDescription"
                className="form-control"
                required
                name="description"
              />
            </div>
            <div className="mb-3" style={{ paddingBottom: 5 }}>
              <label htmlFor="inputDay">Day</label>
              <Field
                name="day"
                id="inputDay"
                className="form-control"
                required
              />
            </div>
            <div className="mb-3" style={{ paddingBottom: 5 }}>
              <label htmlFor="inputLevel">Level</label>
              <Field
                name="level"
                id="inputLevel"
                className="form-control"
                required
              />
            </div>
            <div style={{ justifyContent: "center", alignContent: "center" }}>
              <button className="btn btn-primary">Submit</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export function AddSession() {
  return (
    <>
      <section className="banner">
        <div className="container">
          <div className="row">
            <SessionForm />
          </div>
        </div>
      </section>
    </>
  );
}
