import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Row } from "antd";
import MentorList from "../components/MentorList";
const HomePage = () => {
  const [mentors, setMentors] = useState([]);
  // login user data
  const getUserData = async () => {
    try {
      const res = await axios.get(
        "/api/v1/user/getAllMentors",

        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setMentors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <Layout>
      <h1 className="text-xl px-4 py-3 font-bold text-gray-600">Home Page</h1>
      <Row>
        
        {/* passing mentors as a prop to the component mentor list */}
        {mentors && mentors.map((mentor) => <MentorList mentor={mentor} />)}
      </Row>
    </Layout>
  );
};

export default HomePage;