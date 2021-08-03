import React from "react";
import { Row, Col, Divider, Image } from "antd";

const Monitoring = ({ instance, config }) => {
  return instance.data?.map((d, di) => {
    const submission = config.definition.find(
      (x) => x.name === "Submission Date"
    );
    const photo = config.definition.find((x) => x.name === "Photo");
    return (
      <div key={di} style={{ padding: "20px" }}>
        <Divider orientation="left">{d?.[submission.alias]}</Divider>
        {photo && (
          <Row style={{ height: 310, overflow: "hidden", marginBottom: 20 }}>
            <Col
              span={24}
              className="image-overlay"
              style={{
                backgroundImage: `url("${d?.[photo.alias]}")`,
                height: 320,
              }}
            ></Col>
            <Col span={24} align="center" style={{ marginTop: -320 }}>
              <Image
                src={d?.[photo.alias]}
                alt={d?.[photo.alias]}
                height={320}
              />
            </Col>
          </Row>
        )}
        {config.definition
          .filter((x) => x.name !== "Photo" || x.name !== "Submission Date")
          .map((x, xi) => (
            <Row justify="end" key={xi}>
              <Col span={12}>{x.name}</Col>
              <Col span={12} style={{ textAlign: "right" }}>
                {d?.[x.alias]}
              </Col>
            </Row>
          ))}
      </div>
    );
  });
};

export default Monitoring;
