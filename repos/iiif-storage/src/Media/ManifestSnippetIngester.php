<?php

namespace IIIFStorage\Media;

use Digirati\OmekaShared\Utility\PropertyIdSaturator;
use Omeka\Api\Manager;
use Omeka\Api\Representation\ItemRepresentation;
use Omeka\Form\Element\ResourceSelect;
use Omeka\Media\Ingester\IngesterInterface;
use Zend\Form\Element;
use Zend\View\Renderer\PhpRenderer;

class ManifestSnippetIngester extends AbstractIngester implements IngesterInterface
{

    /**
     * @var Manager
     */
    private $api;
    /**
     * @var PropertyIdSaturator
     */
    private $saturator;

    public function __construct(
        Manager $api,
        PropertyIdSaturator $saturator
    ) {
        $this->api = $api;
        $this->saturator = $saturator;
    }

    /**
     * Get a human-readable label for this ingester.
     *
     * @return string
     */
    public function getLabel()
    {
        return 'Manifest snippet';
    }

    /**
     * Get the name of the renderer for media ingested by this ingester
     *
     * @return string
     */
    public function getRenderer()
    {
        return 'iiif-manifest-snippet';
    }

    public function renderFormElements(PhpRenderer $view, array $formElements)
    {
        $elements = parent::renderFormElements($view, $formElements); // TODO: Change the autogenerated stub
        return implode('', [
            $elements,
            '<script>$("body").on(\'click [data-media-type="iiif-manifest-snippet"]\', function () { $("#manifest-select").chosen(chosenOptions); });</script>',
        ]);
    }

    /**
     * @param string $operation either "create" or "update"
     * @return Element[]
     */
    public function getFormElements(string $operation): array
    {
        $manifest = new Element\Text('manifest');
        $manifest->setAttributes([
            'required' => false,
        ]);
        $manifest->setOptions([
            'label' => 'Manifest ID', // @translate
            'info' => 'Paste in an ID of the manifest to be displayed.', // @translate
        ]);

        return [
            $manifest,
        ];
    }
}
