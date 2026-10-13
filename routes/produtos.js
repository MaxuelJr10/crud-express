const express = require("express");
const router = express.Router();
const db = require("../database/banco");

router.get("/", (req, res) => {
    db.all("SELECT * FROM produtos", [], (erro, produtos) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao consultar produtos" });
        }

        res.json(produtos);
    });
});

router.get("/:id", (req, res) => {
    db.get(
        "SELECT * FROM produtos WHERE id = ?",
        [req.params.id],
        (erro, produto) => {
            if (erro) {
                return res.status(500).json({ erro: "Erro ao consultar produto" });        
            }

            if (!produto) {
                return res.status(404).json({ erro: "Produto não encontrado" });
            }

            res.json(produto);
        }
    );
});

router.post("/", (req, res) => {
    const { nome, valor, quantidade, cor } = req.body;

    if (
        typeof nome !== "string" || !nome.trim() ||
        valor === undefined || valor === null ||
        valor === "" || !Number.isFinite(Number(valor)) ||
        quantidade === undefined || quantidade === null ||
        quantidade  === "" || !Number.isInteger(Number(quantidade)) ||
        Number(valor) < 0 || Number(quantidade) < 0
    ) {
        return res.status(400).json({ erro: "Dados inválidos" });
    }

    db.run(
        'INSERT INTO produtos (nome, valor, quantidade, cor) VALUES (?, ?, ?, ?)',
        [nome.trim(), Number(valor), Number(quantidade), cor || ""],
        function (erro) {
            if (erro) {
                return res.status(500).json({ erro: "Erro ao cadastrar produto" });
            }

            res.status(201).json({
                id: this.lastID,
                nome: nome.trim(),
                valor: Number(valor),
                quantidade: Number(quantidade),
                cor: cor || ""
            });
        }
    );
});

router.put("/:id", (req, res) => {
    const { nome, valor, quantidade, cor } = req.body;

    if (
        typeof nome !== "string" || !nome.trim() ||
        valor === undefined || valor === null ||
        quantidade === undefined || quantidade === null ||
        quantidade === "" || !Number.isInteger(Number(quantidade)) ||
        Number(valor) < 0 || Number(quantidade) < 0
    ) {
        return res.status(400).json({ erro: "Dados inválidos" });
    }

    db.run(
        'UPDATE produtos SET nome = ?, valor = ?, quantidade = ?, cor = ? WHERE id = ?',
        [
            nome.trim(),
            Number(valor),
            Number(quantidade),
            cor || "",
            req.params.id
        ],
        function (erro) {
            if (erro) {
                return res.status(500).json({ erro: "Erro ao atualizar produto" });
            }

            if (this.changes === 0) {
                return res.status(404).json({ erro: "Produto não encontrado" });
            }

            res.json({ mensagem: "Produto atualizado com sucesso" });
        }
    );
});

router.delete("/:id", (req, res) => {
    db.run(
        "DELETE FROM produtos WHERE id = ?",
        [req.params.id],
        function (erro) {
            if (erro) {
                return res.status(500).json({ erro: "Erro ao excluir produto" });
            }

            if (this.changes === 0) {
                return res.status(404).json({ erro: "Produto não encontrado" });
            }

            res.json({ mensagem: "Produto excluído com sucesso" });
        }
    );
});

module.exports = router;
