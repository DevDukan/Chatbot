<?php
namespace Godukkan\Chatbot\Model;

use Magento\Framework\Model\AbstractModel;

class ChatLog extends AbstractModel
{
    protected function _construct()
    {
        $this->_init('Godukkan\Chatbot\Model\ResourceModel\ChatLog');
    }
} 