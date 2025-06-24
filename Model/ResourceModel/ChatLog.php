<?php
namespace Godukkan\Chatbot\Model\ResourceModel;

use Magento\Framework\Model\ResourceModel\Db\AbstractDb;

class ChatLog extends AbstractDb
{
    protected function _construct()
    {
        $this->_init('godukkan_chatbot_log', 'log_id');
    }
} 