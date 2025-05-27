import React, { createContext, useContext, useState } from "react";

const initialJobs = [
  {
    id: "HR",
    jobTitle: "Software",
    name: "Dinith",
    gender: "Male",
    field: "IT",
    contact: "074 3231211",
    cv: "dinith.pdf",
    date: "2023/10/14",
    status: "Accepted"
  },
  {
    id: "IT",
    jobTitle: "Telecommunication",
    name: "Dilshara",
    gender: "Male",
    field: "IT",
    contact: "074 3231211",
    cv: "dilshara.pdf",
    date: "2023/09/11",
    status: "Accepted"
  },
  {
    id: "IT",
    jobTitle: "Software",
    name: "John Doe",
    gender: "Male",
    field: "IT",
    contact: "074 3231211",
    cv: "john.pdf",
    date: "2023/10/14",
    status: "Accepted"}
];

const JobsContext = createContext<any>(null);

export function JobsProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState(initialJobs);
  return (
    <JobsContext.Provider value={{ jobs, setJobs }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  return useContext(JobsContext);
}