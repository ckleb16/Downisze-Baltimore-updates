"""Preserve guide artwork while adding fillable worksheets, contact links and fast-web-view output."""
from pathlib import Path
import json
import shutil
import pdfplumber
import pikepdf
from pypdf import PdfReader, PdfWriter
from pypdf.generic import (NameObject, DictionaryObject, ArrayObject, NumberObject,
                          FloatObject, TextStringObject, DecodedStreamObject, BooleanObject)

ROOT = Path(__file__).resolve().parents[1]
GUIDES = ROOT / "client/public/guides"
OUTPUT = ROOT / "output/pdf"
TEMP = ROOT / "tmp/pdfs/guide-enhancement"
OUTPUT.mkdir(parents=True, exist_ok=True)
TEMP.mkdir(parents=True, exist_ok=True)
PUBLIC_SITE = "https://downsize-baltimore-mary-lynch.ckleb16.chatgpt.site/"
TITLES = {
    "what-do-i-do-with-all-this-stuff": "What Do I Do With All This Stuff?",
    "should-i-stay-or-should-i-go": "Should I Stay or Should I Go?",
    "could-an-adu-work-for-your-family": "Could An ADU Work For Your Family?",
}

def obj_rect(values):
    return ArrayObject([FloatObject(v) for v in values])

def enhance(slug, title):
    source = GUIDES / f"{slug}.pdf"
    backup = TEMP / f"{slug}-original.pdf"
    if not backup.exists():
        shutil.copy2(source, backup)
    reader = PdfReader(backup)
    assert not reader.get_fields(), "Do not duplicate existing fields."
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    font = writer._add_object(DictionaryObject({NameObject('/Type'): NameObject('/Font'),
        NameObject('/Subtype'): NameObject('/Type1'), NameObject('/BaseFont'): NameObject('/Helvetica')}))
    fields = ArrayObject()
    acro = DictionaryObject({NameObject('/Fields'): fields,
        NameObject('/DR'): DictionaryObject({NameObject('/Font'): DictionaryObject({NameObject('/Helv'): font})}),
        NameObject('/DA'): TextStringObject('/Helv 11 Tf 0.063 0.165 0.263 rg'),
        NameObject('/NeedAppearances'): BooleanObject(False)})
    writer.root_object[NameObject('/AcroForm')] = writer._add_object(acro)
    plan_page = len(writer.pages) - 2
    page = writer.pages[plan_page]
    height = float(page.mediabox.height)
    if slug.startswith('what-do'):
        regions = [(62, 297, 550, 319), (79, 374, 550, 396), (79, 409, 550, 431),
                   (79, 444, 550, 466), (62, 515, 550, 537), (62, 584, 550, 606)]
        labels = ['One area I can tackle first', 'First easy thing that can go', 'Second easy thing that can go',
                  'Third easy thing that can go', 'One thing I need help figuring out', 'One person or resource I can call']
    else:
        regions = [(62, 207, 550, 258), (62, 314, 550, 365), (62, 421, 550, 472), (62, 528, 550, 579)]
        labels = (['What started me thinking about this', 'The row I circled on page three',
                   'One thing I need to know', 'One person I should talk to and when'] if slug.startswith('should') else
                  ['The row on page three that sounds most like us', 'The problem we are trying to solve',
                   'One thing we need to find out', 'One person we should talk to and when'])
    for index, ((left, top, right, bottom), label) in enumerate(zip(regions, labels), 1):
        name = f'{slug}-plan-{index}'
        appearance = DecodedStreamObject()
        appearance.set_data(b'q\nQ\n')
        appearance.update({NameObject('/Type'): NameObject('/XObject'), NameObject('/Subtype'): NameObject('/Form'),
                           NameObject('/BBox'): obj_rect([0, 0, right-left, bottom-top]),
                           NameObject('/Resources'): acro['/DR']})
        widget = DictionaryObject({NameObject('/Type'): NameObject('/Annot'), NameObject('/Subtype'): NameObject('/Widget'),
            NameObject('/FT'): NameObject('/Tx'), NameObject('/T'): TextStringObject(name), NameObject('/TU'): TextStringObject(label),
            NameObject('/V'): TextStringObject(''), NameObject('/DV'): TextStringObject(''), NameObject('/F'): NumberObject(4),
            NameObject('/Ff'): NumberObject(4096 if len(regions) == 4 else 0), NameObject('/MaxLen'): NumberObject(400 if len(regions)==4 else 180),
            NameObject('/Rect'): obj_rect([left, height-bottom, right, height-top]), NameObject('/P'): page.indirect_reference,
            NameObject('/DA'): acro['/DA'], NameObject('/AP'): DictionaryObject({NameObject('/N'): writer._add_object(appearance)}),
            NameObject('/BS'): DictionaryObject({NameObject('/W'): NumberObject(0)})})
        ref = writer._add_object(widget)
        fields.append(ref)
        if '/Annots' not in page: page[NameObject('/Annots')] = ArrayObject()
        page['/Annots'].append(ref)
    with pdfplumber.open(backup) as document:
        for page_index, text_page in enumerate(document.pages):
            words = text_page.extract_words()
            for index, word in enumerate(words):
                text = word['text']
                uri = None
                left = word['x0']; right = word['x1']
                if '@downsizebaltimore.com' in text: uri = 'mailto:mary@downsizebaltimore.com'
                elif 'DownsizeBaltimore.com' in text: uri = PUBLIC_SITE
                elif '375-1400' in text or '823-0033' in text:
                    uri = 'tel:+14103751400' if '375' in text else 'tel:+14108230033'
                    if index and '410' in words[index-1]['text']: left = words[index-1]['x0']
                if not uri: continue
                target = writer.pages[page_index]
                annotation = DictionaryObject({NameObject('/Type'): NameObject('/Annot'), NameObject('/Subtype'): NameObject('/Link'),
                    NameObject('/Rect'): obj_rect([left, text_page.height-word['bottom']-1, right, text_page.height-word['top']+1]),
                    NameObject('/Border'): ArrayObject([NumberObject(0), NumberObject(0), NumberObject(0)]),
                    NameObject('/A'): DictionaryObject({NameObject('/S'): NameObject('/URI'), NameObject('/URI'): TextStringObject(uri)})})
                if '/Annots' not in target: target[NameObject('/Annots')] = ArrayObject()
                target['/Annots'].append(writer._add_object(annotation))
    writer.add_metadata({'/Title': title, '/Author': 'Mary Lynch | Downsize Baltimore',
                         '/Subject': 'Practical housing guidance with a fillable first-small-plan worksheet'})
    intermediate = TEMP / f'{slug}-interactive.pdf'
    writer.write(intermediate)
    final = OUTPUT / f'{slug}.pdf'
    with pikepdf.open(intermediate) as pdf:
        pdf.docinfo['/Title'] = title
        pdf.save(final, linearize=True, compress_streams=True, object_stream_mode=pikepdf.ObjectStreamMode.generate)
    check = PdfReader(final)
    expected = {f'{slug}-plan-{i}': '' for i in range(1, len(regions)+1)}
    actual = check.get_fields()
    assert set(actual) == set(expected)
    assert all(actual[name].get('/V') == value for name,value in expected.items())
    widgets = [a.get_object() for p in check.pages for a in p.get('/Annots', []) if a.get_object().get('/Subtype') == '/Widget']
    assert len(widgets) == len(expected)
    assert all(w.get('/V') == '' and len(w['/AP']['/N'].get_data()) > 0 for w in widgets)
    assert sum(a.get_object().get('/Subtype') == '/Link' for p in check.pages for a in p.get('/Annots', [])) >= 4
    assert check.metadata.title == title
    with pikepdf.open(final) as pdf: assert pdf.is_linearized
    filled = PdfWriter(); filled.clone_document_from_reader(check)
    samples = {name: 'A first small step I can take this week.' for name in expected}
    filled.update_page_form_field_values(None, samples, auto_regenerate=False)
    filled_path = TEMP / f'{slug}-filled-check.pdf'; filled.write(filled_path)
    filled_check = PdfReader(filled_path)
    assert all(filled_check.get_fields()[name]['/V'] == value for name,value in samples.items())
    assert all(a.get_object().get('/V') == samples[a.get_object()['/T']] for p in filled_check.pages for a in p.get('/Annots', []) if a.get_object().get('/Subtype') == '/Widget')
    shutil.copy2(final, source)
    return {'slug': slug, 'pages': len(check.pages), 'fields': len(expected), 'bytes': source.stat().st_size, 'linearized': True}

results = [enhance(slug,title) for slug,title in TITLES.items()]
print(json.dumps(results))
