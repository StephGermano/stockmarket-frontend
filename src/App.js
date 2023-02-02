import "./App.css";
import { useEffect, useState } from "react";
import {
  Table,
  InputGroup,
  Form,
  Button,
  Accordion,
  Container,
} from "react-bootstrap";
import { BsFillTrashFill } from "react-icons/bs";
import api from "./services/api";

function App() {
  const [companyDatabase, setCompanyDatabase] = useState([]);

  const [company, setCompany] = useState("");
  const [ticket, setTicket] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");

  async function searchCompanys() {
    api.get("/stockmarket").then((r) => {
      setCompanyDatabase(r.data);
    });
  }

  async function registerCompany() {
    const newCompany = {
      company,
      ticket,
      price: parseFloat(price).toFixed(2),
      amount: parseInt(amount),
      type,
    };
    await api
      .post("/stockmarket/", newCompany)
      .then((r) => {
        setCompanyDatabase([...companyDatabase, r.data]);
        alert(`Empresa cadastrada com sucesso`);
        cleanForm();
      })
      .catch((r) => {
        alert(`Empresa ou ticket já cadastrado`);
      });
  }

  async function deleteCompany(company) {
    await api.delete(`/stockmarket/${company}`).then(() => {
      searchCompanys();
      alert(`Empresa excluida com sucesso`);
    });
  }

  useEffect(() => {
    searchCompanys();
  }, []);

  function cleanForm() {
    setCompany("");
    setTicket("");
    setPrice("");
    setAmount("");
    setType("");
  }

  return (
    <>
      <Container>
        <div className="container">
          <InputGroup className="mb-3 mt-3">
            <Form.Control
              placeholder="Empresa"
              value={company}
              onChange={(e) => {
                setCompany(e.target.value);
              }}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Ticket"
              value={ticket}
              onChange={(e) => {
                setTicket(e.target.value);
              }}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">R$</InputGroup.Text>
            <Form.Control
              placeholder="Preço"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Quantidade"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Tipo"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
              }}
            />
          </InputGroup>
          <Button onClick={registerCompany}>Cadastrar</Button>
        </div>
      </Container>
      <br />
      <h1 className="center">Stock Market</h1>
      <Container>
        <div className="mt-3">
          {companyDatabase.map((c) => {
            return (
              <Accordion
                className="mb-2 border border-dark rounded"
                defaultActiveKey={c.id}
              >
                <Accordion.Item eventKey={c.id}>
                  <Accordion.Header>
                    {`${c.company} - ${c.ticket}`}
                  </Accordion.Header>
                  <Accordion.Body>
                    <Table hover borderes size="sm">
                      <thead>
                        <tr className="center">
                          <th>Preço de Compra</th>
                          <th>Quantidade</th>
                          <th>Valor total</th>
                          <th>Tipo de ação</th>
                          <th>Excluir</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="center">
                          <td>R$ {c.price}</td>
                          <td>{c.amount}</td>
                          <td>R$ {c.price * c.amount}</td>
                          <td>{c.type}</td>
                          <td>
                            <Button
                              onClick={() => {
                                deleteCompany(c.company);
                              }}
                            >
                              {" "}
                              <BsFillTrashFill />
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            );
          })}
        </div>
      </Container>
    </>
  );
}

export default App;
