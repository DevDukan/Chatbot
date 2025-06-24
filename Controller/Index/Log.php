<?php
namespace Godukkan\Chatbot\Controller\Index;

use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\Controller\ResultFactory;
use Godukkan\Chatbot\Api\ChatLogRepositoryInterface;
use Magento\Framework\App\RequestInterface;

class Log extends Action
{
    protected $chatLogRepository;
    protected $request;

    public function __construct(
        Context $context,
        ChatLogRepositoryInterface $chatLogRepository,
        RequestInterface $request
    ) {
        $this->chatLogRepository = $chatLogRepository;
        $this->request = $request;
        parent::__construct($context);
    }

    public function execute()
    {
        $result = ['success' => false];
        if ($this->getRequest()->isPost()) {
            $data = [
                'session_id' => $this->getRequest()->getParam('session_id'),
                'user_name' => $this->getRequest()->getParam('user_name'),
                'user_email' => $this->getRequest()->getParam('user_email'),
                'message' => $this->getRequest()->getParam('message'),
                'sender' => $this->getRequest()->getParam('sender'),
            ];
            $this->chatLogRepository->save($data);
            $result['success'] = true;
        }
        $resultJson = $this->resultFactory->create(ResultFactory::TYPE_JSON);
        $resultJson->setData($result);
        return $resultJson;
    }
} 