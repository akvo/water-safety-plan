import React, { createElement, useState } from "react";
import {
  Row,
  Col,
  Card,
  Divider,
  Comment,
  Tooltip,
  Avatar,
  Form,
  Input,
  Button,
} from "antd";
import moment from "moment";
import {
  DislikeOutlined,
  LikeOutlined,
  DislikeFilled,
  LikeFilled,
} from "@ant-design/icons";

const { TextArea } = Input;

const avt = {
  Franky: "https://akvo.org/wp-content/uploads/2019/11/Franky-Li-240.jpg",
  Mert: "https://akvo.org/wp-content/uploads/2019/03/mert-240-240x134.jpg",
  etc:
    "https://cdn1.vectorstock.com/i/thumb-large/22/05/male-profile-picture-vector-1862205.jpg",
};

const CommentList = ({ data }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [action, setAction] = useState(null);

  const like = () => {
    setLikes(1);
    setDislikes(0);
    setAction("liked");
  };

  const dislike = () => {
    setLikes(0);
    setDislikes(1);
    setAction("disliked");
  };

  const actions = [
    <Tooltip key="comment-basic-like" title="Like">
      <span onClick={like}>
        {createElement(action === "liked" ? LikeFilled : LikeOutlined)}
        <span className="comment-action">{likes}</span>
      </span>
    </Tooltip>,
    <Tooltip key="comment-basic-dislike" title="Dislike">
      <span onClick={dislike}>
        {React.createElement(
          action === "disliked" ? DislikeFilled : DislikeOutlined
        )}
        <span className="comment-action">{dislikes}</span>
      </span>
    </Tooltip>,
    <span key="comment-basic-reply-to">Reply to</span>,
  ];

  return (
    <Row>
      <Col span={24}>
        <Card>
          <Divider orientation="left">User Feedback</Divider>
          {data.map((x, i) => (
            <Comment
              key={i}
              actions={actions}
              author={<a>{x["Name"]}</a>}
              avatar={<Avatar src={avt[x["Name"]] || avt.etc} alt="Han Solo" />}
              content={<p>{x["Comments"]}</p>}
              datetime={
                <Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
                  <span>{moment().fromNow()}</span>
                </Tooltip>
              }
            />
          ))}
          <Divider orientation="left">Submit New Feedback</Divider>
          <Form.Item>
            <Input addonBefore="Email" placeholder="e.g john@akvo.org" />
          </Form.Item>
          <Form.Item>
            <TextArea placeholder="Comments" />
          </Form.Item>
          <Form.Item>
            <Button type="primary">Submit</Button>
          </Form.Item>
        </Card>
      </Col>
    </Row>
  );
};

export default CommentList;
