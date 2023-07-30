import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchFn } from "../etc/NetworkUtils";
import ReplyInsert from "../reply/ReplyInsert";
import ReplyList from "../reply/ReplyList";
import { Button, Modal } from "react-bootstrap";
import OrderInsert from "../order/OrderInsert";
import moment from "moment";
import Card from 'react-bootstrap/Card';

function ItemDetail() {
  const LOGINER = localStorage.getItem("LOGINER");
  const id = useParams().id;
  const username = useParams().username;
  const [item, setItem] = useState(null);
  const bid = useParams().id;
  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false); // 모달 열기/닫기 상태

  const uploaderId = localStorage.getItem("LOGINER");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchFn(
      "GET",
      `http://localhost:8000/item-service/item/id/${id}`,
      null
    ).then((data) => {
      setItem(data);
    });
  }, [id]);

  useEffect(() => {
    if (file) {
      filedelete();
      handleFileUpload();
    }
  }, [file]);

  function filedelete() {
    const token = localStorage.getItem("BTOKEN");
    const url = "http://localhost:8000/file-service/filedelete";
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ bid: bid }),
    };

    fetch(url, options)
      .then((response) => {})
      .then((data) => {});
  }

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  function handleFileUpload() {
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploaderId", uploaderId);
    formData.append("bid", bid);

    const token = localStorage.getItem("BTOKEN");
    const url = "http://localhost:8000/file-service/fileupload";
    const options = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    };

    fetch(url, options)
      .then((response) => {
        // 응답 처리 로직
        if (!response) {
          console.log(response);
        }
      })
      .then((data) => {
        console.log("File upload success:", data);
        window.location.href = `/item-service/detail/${id}`;
      })
      .catch((error) => {
        console.error("File upload error:", error);
      });
  }

  useEffect(() => {
    const url = `http://localhost:8000/file-service/image/${bid}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(url, options)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Image not found");
        }
      })
      .then((data) => {
        setImage(data.result);
      })
      .catch((error) => {
        console.log(error);
        setImage(null);
      });
  }, [bid]);

  const b = image ? image.dbsaveFilename : null;

  function onsubmitHandler(e) {
    e.preventDefault();

    fetchFn(
      "GET",
      `http://localhost:8000/api/item/list/username/search?username=${username}&pageNum=0`,
      null
    ).then((data) => {
      window.location.href = `/item/list/username/${item.username}`;
    });
  }

  function deleteHere() {
    let isOk = window.confirm("정말 삭제하시겠습니까?");

    if (isOk) {
      const dto = {
        id,
      };
      fetchFn(
        "DELETE",
        "http://localhost:8000/item-service/item/manager",
        dto
      ).then(() => {
        window.location.href = "/item-service/list";
      });
    }
  }

  function aaaaa(){
    alert("로그인 후 이용가능")
  }


  function handleImageUploadClick() {
    fileInputRef.current.click();
  }

  // 모달 열기/닫기 함수
  function toggleModal() {
    setShowModal(!showModal);
  }

  const getDiscountedPrice = () => {
    const discountedPrice = (item.price * (100 - item.discount)) / 100;
    return Math.round(discountedPrice);
  };

  function onClickHandler1(){
    window.location.href = "/item-service/list"
  }
  
  function onClickHandler2(){
    window.location.href = "/item-service/list/itemType/상의"
  }

  function onClickHandler3(){
    window.location.href = "/item-service/list/itemType/하의"
  }

  function onClickHandler4(){
    window.location.href = "/item-service/list/itemType/모자"
  }

  function onClickHandler5(){
    window.location.href = "/item-service/list/itemType/가방"
  }


  return (
    <div style={{ display: 'flex', minHeight: "100vh" }}>
      <div style={{ width: '80px', borderRight: '1px solid #ccc' ,padding: '10px', background: 'black' }}>
      <Button variant='dark' block="true" onClick={onClickHandler1} className="mb-4 custom-button">
            <strong>전부</strong>
            </Button>
            <Button variant="dark" block="true" onClick={onClickHandler2} className="mb-2 custom-button">
              <strong>상의</strong>
            </Button>
            <Button variant="dark" block="true" onClick={onClickHandler3} className="mb-2 custom-button">
              <strong>하의</strong>
            </Button>
            <Button variant="dark" block="true" onClick={onClickHandler4} className="mb-2 custom-button">
              <strong>모자</strong>
            </Button>
            <Button variant="dark" block="true" onClick={onClickHandler5} className="mb-2 custom-button">
              <strong>가방</strong>
            </Button>
    
      </div>
      <div style={{ flex: 1 }}>
        <h2 style={{ textAlign: 'center', marginBottom: '50px' }}>상품정보 자세히 보기</h2>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}>
            {image !== null ? (
              <>
                <img src={`/img/${b}`} width={500} height={500} />
              </>
            ) : (
              <img src="/img/a.jpg" />
            )}
          </div>
          <div style={{ flex: 1 }}>
            {item !== null && (
              <>
                <Card style={{ width: '300px' }}>
                  <Card.Body>
                    {item.member && <Card.Text>등록자: {item.member.username}</Card.Text>}
                    <Card.Text>
                      등록자:{" "}
                      <Link
                        className='b'
                        to={`/item-service/list/username/${item.username}`}
                        onSubmit={onsubmitHandler}
                      >
                        {item.username}
                      </Link>
                    </Card.Text>
                    <Card.Text>상품이름: {item.itemName}</Card.Text>
                    <Card.Text>가격: {item.price}</Card.Text>
                    <Card.Text>할인률: {item.discount}</Card.Text>
                    <Card.Text>할인가격 : {getDiscountedPrice()}</Card.Text>
                    <Card.Text>재고: {item.ea}</Card.Text>
                    <Card.Text>상품정보: {item.itemDescribe}</Card.Text>
                    <Card.Text>종류: {item.itemType}</Card.Text>
                    <Card.Text>등록날짜: {moment(item.createDate).format('YYYY-MM-DD')}</Card.Text>

                  {LOGINER === item.username ? (
                    <>
                      <Button variant="dark" onClick={handleImageUploadClick}>
                        이미지 등록
                      </Button>
                      &nbsp;
                      <Button variant="dark">
                        <Link className="a" to={`/item-service/update/${id}`}>
                          수정
                        </Link>
                      </Button>
                      &nbsp;
                      <Button variant="dark">
                        <Link className="a" onClick={deleteHere}>
                          삭제
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      {LOGINER === "null" ? (
                        <>
                          <Button variant="dark" onClick={aaaaa}>
                              구매
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="dark" onClick={toggleModal}>
                            구매
                          </Button>
                        </>
                      )}
                    </>
                  )}
                  <form action="#" encType="multipart/form-data" display="inline">
                    <input
                      type="file"
                      name="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    <input
                      type="submit"
                      disabled={file !== null}
                      style={{ display: "none" }}
                    />
                  </form>
                  </Card.Body>
                </Card>
              </>
            )}
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <ReplyInsert />
          <ReplyList />
        </div>
      </div>
      {/* 구매 모달 */}
      <Modal show={showModal} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>구매</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OrderInsert />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ItemDetail;