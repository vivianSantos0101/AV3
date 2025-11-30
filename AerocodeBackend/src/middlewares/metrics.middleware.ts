import { Request, Response, NextFunction } from 'express';

// Middleware para calcular o tempo de processamento do servidor
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // process.hrtime() oferece maior precisão (nanossegundos) que Date.now()
    const start = process.hrtime(); 

    // Guarda a função original que envia a resposta (res.send ou res.json)
    const originalSend = res.send.bind(res);
    
    // Sobrescreve o método 'send' para injetar a métrica antes de enviar
    res.send = (body) => {
        // 1. Calcula o tempo decorrido
        const diff = process.hrtime(start);
        // Converte o tempo de (segundos, nanosegundos) para milissegundos (ms)
        const timeInMs = (diff[0] * 1000 + diff[1] / 1e6);

        // 2. Adiciona o Header customizado com o tempo de processamento
        res.setHeader('X-Processing-Time', timeInMs.toFixed(3)); // 3 casas decimais

        // 3. Chama o método original para finalizar e enviar a resposta
        return originalSend(body);
    };
    
    // Continua para a próxima função (o Controller da sua rota)
    next();
};