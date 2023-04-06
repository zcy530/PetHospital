//试卷详情
import { Divider } from "antd";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form } from "react-bootstrap";
import { oneExamQuestions } from "./mockExamData.tsx";
import { oneQuestionAnswer, examPaper } from "./examTypeDefine.tsx";

export interface examDetailsProps {
    id: number;
    setStartExam: (startExam: boolean) => void;
    setEndExam: (endExam: boolean) => void;
}

const ExamDetail = (props: examDetailsProps) => {

    return (
        <div className="exam-container">
            <h3>{oneExamQuestions.paperName}</h3>
            <Divider />
            <Form
                style={{ marginLeft: '100px', marginRight: '100px', fontSize: '17.5px', textAlign: 'left' }}>


                {oneExamQuestions.questionList.map((question, index) => (
                    <>
                        <Form.Group className="mb-3" controlId="question">
                            <Form.Label>
                                {index + 1}. {' '}<b>({question.questionType}){' '}</b>{question.description}
                            </Form.Label>

                            {/* 四个答案竖着排列 */}
                            {question.choice.map((choice, subindex) => (
                                <Form.Check
                                    type="checkbox"
                                    id={subindex}
                                    label={choice}
                                />
                            ))}
                        </Form.Group>
                        <Divider />
                    </>
                ))}

            </Form>

        </div>
    );
}

export default ExamDetail;