<?php
namespace Godukkan\Chatbot\Controller\Adminhtml\Live;

use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;
use Magento\Framework\View\Result\PageFactory;

class Index extends Action
{
    /**
     * @var PageFactory
     */
    protected $resultPageFactory;

    public function __construct(Context $context, PageFactory $resultPageFactory)
    {
        $this->resultPageFactory = $resultPageFactory;
        parent::__construct($context);
    }

    public function execute()
    {
        $resultPage = $this->resultPageFactory->create();
        $resultPage->setActiveMenu('Godukkan_Chatbot::live_chat');
        $resultPage->getConfig()->getTitle()->prepend(__('Godukkan Live Chat'));
        return $resultPage;
    }
} 