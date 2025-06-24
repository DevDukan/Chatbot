<?php
namespace Godukkan\Chatbot\Api;

interface ChatLogRepositoryInterface
{
    /**
     * Save a chat log entry
     */
    public function save(array $data);

    /**
     * Get chat logs by session
     */
    public function getBySession($sessionId);

    /**
     * Get all chat logs
     */
    public function getAll();
} 