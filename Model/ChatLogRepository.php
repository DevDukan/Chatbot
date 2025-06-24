<?php
namespace Godukkan\Chatbot\Model;

use Godukkan\Chatbot\Api\ChatLogRepositoryInterface;
use Godukkan\Chatbot\Model\ChatLogFactory;
use Godukkan\Chatbot\Model\ResourceModel\ChatLog as ChatLogResource;
use Godukkan\Chatbot\Model\ResourceModel\ChatLog\CollectionFactory;

class ChatLogRepository implements ChatLogRepositoryInterface
{
    protected $chatLogFactory;
    protected $chatLogResource;
    protected $collectionFactory;

    public function __construct(
        ChatLogFactory $chatLogFactory,
        ChatLogResource $chatLogResource,
        CollectionFactory $collectionFactory
    ) {
        $this->chatLogFactory = $chatLogFactory;
        $this->chatLogResource = $chatLogResource;
        $this->collectionFactory = $collectionFactory;
    }

    public function save(array $data)
    {
        $chatLog = $this->chatLogFactory->create();
        $chatLog->addData($data);
        $this->chatLogResource->save($chatLog);
        return $chatLog;
    }

    public function getBySession($sessionId)
    {
        $collection = $this->collectionFactory->create();
        $collection->addFieldToFilter('session_id', $sessionId);
        return $collection->getData();
    }

    public function getAll()
    {
        $collection = $this->collectionFactory->create();
        return $collection->getData();
    }
} 